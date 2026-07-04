import { chromium } from '@playwright/test'
import { execFileSync, spawn } from 'node:child_process'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import gifenc from 'gifenc'
import { PNG } from 'pngjs'
import { readFileSync } from 'node:fs'

const port = 5197
const baseUrl = `http://127.0.0.1:${port}`
const proofDir = join(process.cwd(), 'docs', 'proof')
const downloadsDir = join(proofDir, 'downloads')
const { GIFEncoder, applyPalette, quantize } = gifenc

await mkdir(proofDir, { recursive: true })
await mkdir(downloadsDir, { recursive: true })

const serverCommand = process.platform === 'win32' ? 'cmd.exe' : 'npm'
const serverArgs =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', `npm run dev -- --host 127.0.0.1 --port ${port}`]
    : ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)]

const server = spawn(serverCommand, serverArgs, {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
})

try {
  await waitForServer(baseUrl)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
    recordVideo: {
      dir: proofDir,
      size: { width: 1280, height: 900 },
    },
  })
  const page = await context.newPage()
  const video = page.video()
  const shots = []

  await page.goto(baseUrl)
  await page.getByRole('heading', { name: 'OpsPilot Pro Operations Workspace' }).waitFor()
  shots.push(await screenshot(page, 'opspilot-final-polish-01-dashboard.png'))

  await page.getByRole('button', { name: 'Admin Dashboard' }).click()
  await page.getByRole('heading', { name: 'Admin and export dashboard' }).waitFor()
  await page.getByRole('heading', { name: 'Developer diagnostics' }).waitFor()
  shots.push(await screenshot(page, 'opspilot-final-polish-02-admin-diagnostics.png'))

  await page.getByRole('button', { name: 'Generate from intake' }).first().click()
  await page.getByText(/Generated with deterministic fallback|Generated through optional server-side AI route/).waitFor()
  await page.getByRole('heading', { name: 'SOP procedure editor' }).waitFor()
  shots.push(await screenshot(page, 'opspilot-final-polish-03-generated-sop.png'))

  await page.getByRole('button', { name: 'Training Checklist' }).click()
  await page.getByRole('heading', { name: 'Training checklist builder' }).waitFor()
  await page.locator('.check-row input').first().check()
  shots.push(await screenshot(page, 'opspilot-final-polish-04-training.png'))

  await page.getByRole('button', { name: 'Knowledge Base' }).click()
  await page.getByRole('heading', { name: 'Knowledge base articles' }).waitFor()
  shots.push(await screenshot(page, 'opspilot-final-polish-05-knowledge.png'))

  await page.getByRole('button', { name: 'Gap Detector' }).click()
  await page.getByRole('heading', { name: 'Documentation gap report' }).waitFor()
  await page.locator('.gap-row button').first().click()
  shots.push(await screenshot(page, 'opspilot-final-polish-06-gap-fixed.png'))

  await page.getByRole('button', { name: 'Admin Dashboard' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export workspace' }).first().click()
  const download = await downloadPromise
  await download.saveAs(join(downloadsDir, 'opspilot-final-polish-workspace-export.json'))
  await page.getByText('Exported workspace bundle').waitFor()
  shots.push(await screenshot(page, 'opspilot-final-polish-07-exported.png'))

  for (const viewport of [
    { width: 390, height: 844, name: 'mobile-390x844' },
    { width: 430, height: 932, name: 'mobile-430x932' },
    { width: 768, height: 1024, name: 'tablet-768x1024' },
    { width: 1440, height: 1000, name: 'desktop-1440x1000' },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto(baseUrl)
    await page.getByRole('heading', { name: 'OpsPilot Pro Operations Workspace' }).waitFor()
    await screenshot(page, `opspilot-final-polish-${viewport.name}.png`)
  }

  await context.close()
  await browser.close()

  if (video) {
    const videoPath = await video.path()
    await copyFile(videoPath, join(proofDir, 'opspilot-final-polish-workflow.webm'))
    await rm(videoPath, { force: true })
  }

  await createGif(shots, join(proofDir, 'opspilot-final-polish-workflow.gif'))
} finally {
  stopServer(server)
}

async function screenshot(page, fileName) {
  const filePath = join(proofDir, fileName)
  await page.screenshot({ path: filePath, fullPage: false })
  return filePath
}

async function waitForServer(url) {
  const started = Date.now()
  while (Date.now() - started < 60_000) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Keep polling until Vite is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function createGif(files, outputPath) {
  const gif = GIFEncoder()
  for (const file of files) {
    const png = PNG.sync.read(readFileSync(file))
    const palette = quantize(png.data, 128)
    const index = applyPalette(png.data, palette)
    gif.writeFrame(index, png.width, png.height, { palette, delay: 800 })
  }
  gif.finish()
  await writeFile(outputPath, gif.bytes())
}

function stopServer(childProcess) {
  if (!childProcess.pid) return
  try {
    if (process.platform === 'win32') {
      execFileSync('taskkill', ['/pid', String(childProcess.pid), '/T', '/F'], { stdio: 'ignore' })
      return
    }
    childProcess.kill('SIGTERM')
  } catch {
    // The server may already be closed after proof capture.
  }
}
