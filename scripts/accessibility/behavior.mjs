export function classifyHorizontalOverflow({ scrollWidth, clientWidth }) {
  return scrollWidth - clientWidth <= 2 ? 'pass' : 'review'
}

export function summarizeFocusSequence(sequence) {
  if (sequence.length === 0) return { status: 'no-focusable-control' }

  for (let width = 1; width <= Math.min(4, Math.floor(sequence.length / 2)); width += 1) {
    const tail = sequence.slice(-width)
    const prior = sequence.slice(-(width * 2), -width)
    if (tail.length === prior.length && tail.every((value, index) => value === prior[index])) {
      return { status: 'possible-cycle', repeatedSequence: tail }
    }
  }

  return { status: 'observed' }
}

export async function collectKeyboardFocusObservation(page, maxTabs = 30) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })

  const sequence = []
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab')
    const item = await page.evaluate(() => {
      const element = document.activeElement
      if (!(element instanceof HTMLElement) || element === document.body) return null

      const describeStyle = () => {
        const style = getComputedStyle(element)
        return {
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          outlineColor: style.outlineColor,
          boxShadow: style.boxShadow,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
        }
      }

      const focused = describeStyle()
      element.blur()
      const unfocused = describeStyle()
      element.focus()

      const rect = element.getBoundingClientRect()
      const focusStyleChanged = Object.keys(focused).some((key) => focused[key] !== unfocused[key])
      const obviousFocusStyle =
        (focused.outlineStyle !== 'none' && focused.outlineWidth !== '0px') ||
        (focused.boxShadow !== 'none' && focused.boxShadow !== unfocused.boxShadow)

      const text = (element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || element.getAttribute('name') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120)

      return {
        key: `${element.tagName.toLowerCase()}|${element.getAttribute('role') || ''}|${text}`,
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute('role'),
        nameHint: text,
        inViewport: rect.bottom >= 0 && rect.right >= 0 && rect.top <= innerHeight && rect.left <= innerWidth,
        focusIndicator: obviousFocusStyle ? 'observed' : focusStyleChanged ? 'changed-requires-review' : 'requires-human-triage',
      }
    })

    if (item) sequence.push(item)
  }

  const summary = summarizeFocusSequence(sequence.map((item) => item.key))
  return {
    status: summary.status,
    repeatedSequence: summary.repeatedSequence ?? null,
    tabCount: maxTabs,
    focusableObservations: sequence.length,
    offscreenFocusCount: sequence.filter((item) => !item.inViewport).length,
    focusIndicatorReviewCount: sequence.filter((item) => item.focusIndicator !== 'observed').length,
    sequence,
    interpretation: 'reproducible browser heuristic; requires human triage for ambiguous focus visibility or cycles',
  }
}

export async function collectReflowObservation(page) {
  return page.evaluate(() => {
    const root = document.documentElement
    const body = document.body
    const scrollWidth = Math.max(root.scrollWidth, body?.scrollWidth ?? 0)
    const clientWidth = root.clientWidth
    return {
      scrollWidth,
      clientWidth,
      viewport: { width: innerWidth, height: innerHeight },
    }
  }).then((measurement) => ({
    ...measurement,
    status: classifyHorizontalOverflow(measurement),
    interpretation: measurement.scrollWidth - measurement.clientWidth <= 2 ? 'no document-level horizontal overflow observed' : 'requires human triage for horizontal overflow',
  }))
}

export async function collectReflowAtViewport(page, viewport) {
  const original = page.viewportSize()
  await page.setViewportSize(viewport)
  await page.waitForTimeout(150)
  const observation = await collectReflowObservation(page)
  if (original) await page.setViewportSize(original)
  return observation
}

export async function collectReducedMotionObservation(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(100)
  const observation = await page.evaluate(() => ({
    reducedMotionMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    bodyRendered: Boolean(document.body && document.body.getBoundingClientRect().height > 0),
    documentTitle: document.title,
  }))
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  return {
    ...observation,
    status: observation.reducedMotionMatches && observation.bodyRendered ? 'observed' : 'review',
    interpretation: 'browser reduced-motion preference emulation; not a claim that every animation is manually reviewed',
  }
}
