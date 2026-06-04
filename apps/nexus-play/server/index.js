import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(rootDir, '.env.local') })
dotenv.config({ path: path.join(rootDir, '.env') })

const app = express()
const port = Number(process.env.PORT || 3003)
const startedAt = new Date()

const games = [
  {
    id: 'voidbreak-revenant-sun',
    title: 'Voidbreak: Revenant Sun',
    studio: 'Helioforge Interactive',
    price: 59.99,
    originalPrice: 74.99,
    rating: 4.8,
    releaseDate: '2026-06-18',
    installSize: 72,
    players: '1-4 online',
    genres: ['Action RPG', 'Sci-Fi'],
    tags: ['Controller', 'Cloud Saves', 'Ray Tracing'],
    platforms: ['Windows', 'Linux'],
    status: '20% off',
    accent: '#f06d3c',
    secondary: '#00b894',
    blurb: 'Cinematic solar-punk action RPG with seamless co-op and deep gear crafting.',
    description:
      'Lead a solar salvage crew across collapsing orbital cities, branching faction contracts, and radiant boss encounters built for co-op drop-in sessions.',
  },
  {
    id: 'apex-drift-hyperline',
    title: 'Apex Drift Hyperline',
    studio: 'Blue Hammer Circuit',
    price: 39.99,
    originalPrice: 39.99,
    rating: 4.7,
    releaseDate: '2026-05-30',
    installSize: 44,
    players: '1-12 online',
    genres: ['Racing', 'Arcade'],
    tags: ['Wheel Support', 'PvP', 'Ultra-wide'],
    platforms: ['Windows'],
    status: 'Owned',
    accent: '#f2b84b',
    secondary: '#ef476f',
    blurb: 'High-speed neon racing with tournament ladders and asynchronous rivals.',
    description:
      'A precision arcade racer with reactive synth circuits, daily tournaments, ghost rivals, and vehicle tuning that rewards clean racing lines.',
  },
  {
    id: 'mythborne-citadel',
    title: 'Mythborne Citadel',
    studio: 'Marrowlight Games',
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.9,
    releaseDate: '2026-04-22',
    installSize: 64,
    players: 'Single player',
    genres: ['RPG', 'Fantasy'],
    tags: ['Achievements', 'Cloud Saves', 'Mod Ready'],
    platforms: ['Windows', 'macOS'],
    status: 'Editor pick',
    accent: '#8fd14f',
    secondary: '#c77dff',
    blurb: 'A tactical fantasy RPG where politics and combat rewrite the fortress.',
    description:
      'Shape a fallen citadel through tactical party combat, binding oaths, and a living court system that remembers every alliance.',
  },
  {
    id: 'signal-below',
    title: 'Signal Below',
    studio: 'Low Tide Assembly',
    price: 18.99,
    originalPrice: 24.99,
    rating: 4.6,
    releaseDate: '2026-03-12',
    installSize: 18,
    players: 'Single player',
    genres: ['Horror', 'Adventure'],
    tags: ['HDR', 'Photo Mode', 'Cloud Saves'],
    platforms: ['Windows', 'macOS', 'Linux'],
    status: '24% off',
    accent: '#00a8cc',
    secondary: '#ff6b35',
    blurb: 'A compact deep-sea horror adventure about strange signals and pressure.',
    description:
      'Decode impossible transmissions in a sealed deep-sea relay where sound design, practical puzzles, and unreliable logs drive the mystery.',
  },
  {
    id: 'orbit-syndicate',
    title: 'Orbit Syndicate',
    studio: 'Twelve Moons Studio',
    price: 34.99,
    originalPrice: 34.99,
    rating: 4.5,
    releaseDate: '2026-02-08',
    installSize: 31,
    players: '1-6 online',
    genres: ['Strategy', 'Simulation'],
    tags: ['Cross-play', 'Cloud Saves', 'Deck Verified'],
    platforms: ['Windows', 'Linux'],
    status: 'Owned',
    accent: '#3ddc97',
    secondary: '#ffd166',
    blurb: 'A sleek space economy sim for planners, dealmakers, and fleet architects.',
    description:
      'Run trade lanes, negotiate station treaties, and automate orbital industry in a strategy sim built around readable logistics.',
  },
  {
    id: 'garden-of-steel',
    title: 'Garden of Steel',
    studio: 'Soft Alloy Collective',
    price: 19.99,
    originalPrice: 19.99,
    rating: 4.7,
    releaseDate: '2026-06-01',
    installSize: 12,
    players: '1-4 online',
    genres: ['Cozy', 'Simulation'],
    tags: ['Co-op', 'Cloud Saves', 'Low Spec'],
    platforms: ['Windows', 'macOS', 'Linux'],
    status: 'New',
    accent: '#98c379',
    secondary: '#e5c07b',
    blurb: 'A gentle co-op automation sim about rebuilding a mechanical garden.',
    description:
      'Restore a derelict botanical machine, cultivate metal-fed plants, and invite friends to automate a calm industrial greenhouse.',
  },
]

const gameIds = new Set(games.map((game) => game.id))
const gameIdSchema = z.object({ gameId: z.string().min(1).max(80) })

const profile = {
  user: { name: 'Mara Chen', handle: 'mara.c', tier: 'Founders Circle', region: 'NA-East' },
  wallet: 148.5,
  rewards: 12480,
  wishlist: ['voidbreak-revenant-sun', 'garden-of-steel'],
  cart: ['signal-below'],
  library: [
    { gameId: 'apex-drift-hyperline', acquiredAt: '2026-05-31T14:12:00.000Z', playtimeHours: 18 },
    { gameId: 'mythborne-citadel', acquiredAt: '2026-04-24T18:42:00.000Z', playtimeHours: 42 },
    { gameId: 'orbit-syndicate', acquiredAt: '2026-02-09T20:30:00.000Z', playtimeHours: 63 },
  ],
  orders: [{ id: 'NX-58291', createdAt: '2026-05-31T14:12:00.000Z', total: 39.99, items: ['apex-drift-hyperline'], status: 'Complete' }],
}

const downloadJobs = new Map([
  ['apex-drift-hyperline', { gameId: 'apex-drift-hyperline', startedAt: Date.now() - 1000 * 60 * 95, durationMs: 1000 * 60 * 70 }],
  ['mythborne-citadel', { gameId: 'mythborne-citadel', startedAt: Date.now() - 1000 * 60 * 14, durationMs: 1000 * 60 * 42 }],
])

app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Nexus Play distribution platform', version: '1.0.0', startedAt: startedAt.toISOString(), catalogSize: games.length })
})

app.get('/api/catalog', (_req, res) => {
  res.json({
    featuredGameId: 'voidbreak-revenant-sun',
    genres: Array.from(new Set(games.flatMap((game) => game.genres))).sort(),
    games: games.map(toGameDto),
  })
})

app.get('/api/profile', (_req, res) => {
  res.json(buildProfilePayload())
})

app.post('/api/cart/items', (req, res) => {
  const parsed = gameIdSchema.safeParse(req.body)
  if (!parsed.success || !gameIds.has(parsed.data.gameId)) return res.status(400).json({ error: 'Choose a valid game.' })
  if (ownsGame(parsed.data.gameId)) return res.status(409).json({ error: 'That game is already in the library.' })
  if (!profile.cart.includes(parsed.data.gameId)) profile.cart.push(parsed.data.gameId)
  res.json(buildProfilePayload())
})

app.delete('/api/cart/items/:gameId', (req, res) => {
  profile.cart = profile.cart.filter((item) => item !== req.params.gameId)
  res.json(buildProfilePayload())
})

app.post('/api/wishlist/toggle', (req, res) => {
  const parsed = gameIdSchema.safeParse(req.body)
  if (!parsed.success || !gameIds.has(parsed.data.gameId)) return res.status(400).json({ error: 'Choose a valid game.' })
  profile.wishlist = profile.wishlist.includes(parsed.data.gameId)
    ? profile.wishlist.filter((item) => item !== parsed.data.gameId)
    : [...profile.wishlist, parsed.data.gameId]
  res.json(buildProfilePayload())
})

app.post('/api/checkout', (_req, res) => {
  const purchasable = profile.cart.filter((gameId) => gameIds.has(gameId) && !ownsGame(gameId))
  if (!purchasable.length) return res.status(400).json({ error: 'The cart is empty.' })
  const total = getCartTotals(purchasable).total
  const order = { id: `NX-${Math.floor(10000 + Math.random() * 90000)}`, createdAt: new Date().toISOString(), total, items: purchasable, status: 'Complete' }
  for (const gameId of purchasable) profile.library.push({ gameId, acquiredAt: order.createdAt, playtimeHours: 0 })
  profile.wallet = roundCurrency(Math.max(0, profile.wallet - total))
  profile.rewards += Math.round(total * 100)
  profile.orders.unshift(order)
  profile.cart = []
  res.json({ receipt: order, profile: buildProfilePayload().profile })
})

app.post('/api/downloads/start', (req, res) => {
  const parsed = gameIdSchema.safeParse(req.body)
  if (!parsed.success || !ownsGame(parsed.data.gameId)) return res.status(400).json({ error: 'Only library games can be installed.' })
  const game = findGame(parsed.data.gameId)
  downloadJobs.set(parsed.data.gameId, { gameId: parsed.data.gameId, startedAt: Date.now(), durationMs: Math.max(1000 * 60 * 10, (game?.installSize ?? 20) * 1000 * 36) })
  res.json(buildProfilePayload())
})

app.use(express.static(path.join(rootDir, 'dist')))
app.use((_req, res) => res.sendFile(path.join(rootDir, 'dist', 'index.html')))

app.listen(port, () => {
  console.log(`Nexus Play listening on http://127.0.0.1:${port}`)
})

function buildProfilePayload() {
  return { profile: { ...profile, downloads: Array.from(downloadJobs.values()).map(toDownloadDto), cartTotals: getCartTotals(profile.cart) } }
}

function findGame(gameId) {
  return games.find((game) => game.id === gameId)
}

function ownsGame(gameId) {
  return profile.library.some((item) => item.gameId === gameId)
}

function toGameDto(game) {
  return { ...game, currentPrice: roundCurrency(game.price), discountPercent: game.originalPrice > game.price ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0 }
}

function toDownloadDto(job) {
  const game = findGame(job.gameId)
  const elapsed = Date.now() - job.startedAt
  const progress = Math.min(100, Math.round((elapsed / job.durationMs) * 100))
  return { gameId: job.gameId, status: progress >= 100 ? 'Ready' : 'Downloading', progress, speed: progress >= 100 ? 'Installed' : `${Math.max(18, Math.round((game?.installSize ?? 20) * 1.7))} MB/s`, etaMinutes: Math.ceil(Math.max(0, job.durationMs - elapsed) / 60000) }
}

function getCartTotals(cartIds) {
  const items = cartIds.map(findGame).filter(Boolean)
  const subtotal = roundCurrency(items.reduce((total, game) => total + game.originalPrice, 0))
  const discounts = roundCurrency(items.reduce((total, game) => total + Math.max(0, game.originalPrice - game.price), 0))
  return { count: items.length, subtotal, discounts, total: roundCurrency(subtotal - discounts) }
}

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
