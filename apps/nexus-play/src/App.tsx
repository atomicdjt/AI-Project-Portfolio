import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import clsx from 'clsx'
import {
  Bell,
  Check,
  Compass,
  CreditCard,
  Download,
  Gamepad2,
  Heart,
  Library,
  MessageSquare,
  Monitor,
  Play,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trophy,
  User,
  X,
} from 'lucide-react'
import heroArt from './assets/game-platform-hero.png'
import './App.css'

type View = 'store' | 'library' | 'downloads' | 'wishlist' | 'community'
type SortKey = 'featured' | 'rating' | 'newest' | 'price'

type Game = {
  id: string
  title: string
  studio: string
  price: number
  originalPrice: number
  currentPrice: number
  discountPercent: number
  rating: number
  releaseDate: string
  installSize: number
  players: string
  genres: string[]
  tags: string[]
  platforms: string[]
  status: string
  accent: string
  secondary: string
  blurb: string
  description: string
}

type LibraryItem = { gameId: string; acquiredAt: string; playtimeHours: number }
type DownloadJob = { gameId: string; status: string; progress: number; speed: string; etaMinutes: number }
type Order = { id: string; createdAt: string; total: number; items: string[]; status: string }
type CartTotals = { count: number; subtotal: number; discounts: number; total: number }

type Profile = {
  user: { name: string; handle: string; tier: string; region: string }
  wallet: number
  rewards: number
  wishlist: string[]
  cart: string[]
  library: LibraryItem[]
  orders: Order[]
  downloads: DownloadJob[]
  cartTotals: CartTotals
}

type Catalog = { featuredGameId: string; genres: string[]; games: Game[] }

const navItems = [
  { id: 'store', label: 'Store', icon: Compass },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'community', label: 'Community', icon: MessageSquare },
] satisfies Array<{ id: View; label: string; icon: typeof Compass }>

function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeView, setActiveView] = useState<View>('store')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All')
  const [sort, setSort] = useState<SortKey>('featured')
  const [selectedGameId, setSelectedGameId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busyKey, setBusyKey] = useState('')

  useEffect(() => {
    let ignore = false
    Promise.all([requestJson<Catalog>('/api/catalog'), requestJson<{ profile: Profile }>('/api/profile')])
      .then(([nextCatalog, nextProfile]) => {
        if (ignore) return
        setCatalog(nextCatalog)
        setProfile(nextProfile.profile)
        setSelectedGameId(nextCatalog.featuredGameId)
      })
      .catch((caught) => {
        if (!ignore) setError(caught instanceof Error ? caught.message : 'The platform API is not reachable.')
      })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const games = useMemo(() => catalog?.games ?? [], [catalog])
  const gameMap = useMemo(() => new Map(games.map((game) => [game.id, game])), [games])
  const ownedIds = useMemo(() => new Set(profile?.library.map((item) => item.gameId) ?? []), [profile])
  const cartIds = useMemo(() => new Set(profile?.cart ?? []), [profile])
  const wishlistIds = useMemo(() => new Set(profile?.wishlist ?? []), [profile])
  const downloadMap = useMemo(() => new Map(profile?.downloads.map((job) => [job.gameId, job]) ?? []), [profile])

  const featureGame = gameMap.get(catalog?.featuredGameId ?? '') ?? games[0]
  const selectedGame = gameMap.get(selectedGameId) ?? featureGame
  const cartGames = profile?.cart.map((gameId) => gameMap.get(gameId)).filter(Boolean) as Game[]
  const libraryGames =
    profile?.library.map((item) => ({ item, game: gameMap.get(item.gameId) })).filter((entry) => entry.game) ?? []
  const wishlistGames = profile?.wishlist.map((gameId) => gameMap.get(gameId)).filter(Boolean) as Game[]

  const visibleGames = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return games
      .filter((game) => {
        const matchesQuery = !needle || [game.title, game.studio, game.blurb, ...game.genres, ...game.tags].join(' ').toLowerCase().includes(needle)
        const matchesGenre = genre === 'All' || game.genres.includes(genre)
        return matchesQuery && matchesGenre
      })
      .sort((left, right) => {
        if (sort === 'rating') return right.rating - left.rating
        if (sort === 'newest') return new Date(right.releaseDate).getTime() - new Date(left.releaseDate).getTime()
        if (sort === 'price') return left.currentPrice - right.currentPrice
        return right.discountPercent - left.discountPercent || right.rating - left.rating
      })
  }, [games, genre, query, sort])

  const heroStyle: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, rgba(12, 13, 13, 0.96) 0%, rgba(12, 13, 13, 0.76) 42%, rgba(12, 13, 13, 0.2) 100%), url(${heroArt})`,
  }

  const mutate = async (key: string, action: () => Promise<void>) => {
    setBusyKey(key)
    setError('')
    try {
      await action()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The action failed.')
    } finally {
      setBusyKey('')
    }
  }

  const addToCart = (gameId: string) =>
    mutate(`cart-${gameId}`, async () => {
      const payload = await requestJson<{ profile: Profile }>('/api/cart/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId }) })
      setProfile(payload.profile)
      setNotice('Added to cart.')
    })

  const removeFromCart = (gameId: string) =>
    mutate(`remove-${gameId}`, async () => {
      const payload = await requestJson<{ profile: Profile }>(`/api/cart/items/${gameId}`, { method: 'DELETE' })
      setProfile(payload.profile)
    })

  const toggleWishlist = (gameId: string) =>
    mutate(`wish-${gameId}`, async () => {
      const payload = await requestJson<{ profile: Profile }>('/api/wishlist/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId }) })
      setProfile(payload.profile)
      setNotice(payload.profile.wishlist.includes(gameId) ? 'Saved to wishlist.' : 'Removed from wishlist.')
    })

  const checkout = () =>
    mutate('checkout', async () => {
      const payload = await requestJson<{ receipt: Order; profile: Profile }>('/api/checkout', { method: 'POST' })
      setProfile(payload.profile)
      setActiveView('library')
      setNotice(`Order ${payload.receipt.id} completed.`)
    })

  const startDownload = (gameId: string) =>
    mutate(`download-${gameId}`, async () => {
      const payload = await requestJson<{ profile: Profile }>('/api/downloads/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gameId }) })
      setProfile(payload.profile)
      setActiveView('downloads')
      setNotice('Install queued.')
    })

  if (!catalog || !profile || !featureGame || !selectedGame) {
    return (
      <main className="boot-screen">
        <Gamepad2 size={34} />
        <p>Loading Nexus Play</p>
        {error && <span>{error}</span>}
      </main>
    )
  }

  return (
    <main className="platform-shell">
      <aside className="nav-rail">
        <div className="brand-lockup">
          <div className="brand-mark"><Gamepad2 size={24} /></div>
          <div><strong>Nexus Play</strong><span>PC Distribution</span></div>
        </div>
        <nav className="nav-stack">
          {navItems.map((item) => {
            const Icon = item.icon
            return <button key={item.id} className={clsx(activeView === item.id && 'active')} onClick={() => setActiveView(item.id)}><Icon size={18} /><span>{item.label}</span></button>
          })}
        </nav>
        <div className="account-strip"><User size={18} /><div><strong>{profile.user.name}</strong><span>{profile.user.tier}</span></div></div>
      </aside>

      <section className="workspace">
        <header className="app-topbar">
          <label className="search-box">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search games, studios, tags" />
          </label>
          <div className="topbar-actions"><button className="icon-button" title="Notifications"><Bell size={18} /></button><button className="cart-chip" title="Cart"><ShoppingCart size={18} /><span>{profile.cartTotals.count}</span></button></div>
        </header>

        {notice && <div className="notice-banner"><Check size={16} /><span>{notice}</span></div>}
        {error && <div className="error-banner"><X size={16} /><span>{error}</span></div>}

        <section className="feature-hero" style={heroStyle}>
          <div className="feature-copy">
            <span className="eyebrow"><Sparkles size={15} /> Launch spotlight</span>
            <h1>{featureGame.title}</h1>
            <p>{featureGame.description}</p>
            <div className="feature-meta"><span>{featureGame.players}</span><span>{featureGame.installSize} GB</span><span>{featureGame.platforms.join(', ')}</span></div>
            <div className="hero-actions">
              <button className="primary-action" onClick={() => (ownedIds.has(featureGame.id) ? startDownload(featureGame.id) : addToCart(featureGame.id))} disabled={cartIds.has(featureGame.id) || busyKey !== ''}>
                {ownedIds.has(featureGame.id) ? <Download size={18} /> : <ShoppingCart size={18} />}
                {ownedIds.has(featureGame.id) ? 'Install' : cartIds.has(featureGame.id) ? 'In cart' : formatCurrency(featureGame.currentPrice)}
              </button>
              <button className="secondary-action" onClick={() => toggleWishlist(featureGame.id)}><Heart size={18} fill={wishlistIds.has(featureGame.id) ? 'currentColor' : 'none'} /> Wishlist</button>
            </div>
          </div>
          <div className="feature-stats"><div><Star size={16} /><strong>{featureGame.rating.toFixed(1)}</strong><span>Player rating</span></div><div><ShoppingCart size={16} /><strong>{featureGame.discountPercent}%</strong><span>Launch saving</span></div></div>
        </section>

        <section className="content-grid">
          <div className="main-column">
            {activeView === 'store' && (
              <>
                <section className="store-controls">
                  <div className="genre-row">{['All', ...catalog.genres].map((item) => <button key={item} className={clsx(genre === item && 'selected')} onClick={() => setGenre(item)}>{item}</button>)}</div>
                  <label className="sort-control"><SlidersHorizontal size={17} /><select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}><option value="featured">Featured deals</option><option value="rating">Highest rated</option><option value="newest">Newest</option><option value="price">Lowest price</option></select></label>
                </section>
                <section className="catalog-grid">{visibleGames.map((game) => <GameCard key={game.id} game={game} selected={selectedGame.id === game.id} owned={ownedIds.has(game.id)} inCart={cartIds.has(game.id)} wished={wishlistIds.has(game.id)} onSelect={() => setSelectedGameId(game.id)} onAdd={() => addToCart(game.id)} onWish={() => toggleWishlist(game.id)} onInstall={() => startDownload(game.id)} />)}</section>
              </>
            )}
            {activeView === 'library' && <List title="Library" items={libraryGames.map((entry) => ({ game: entry.game as Game, meta: `${entry.item.playtimeHours}h played`, action: 'Install' }))} onInstall={startDownload} downloadMap={downloadMap} />}
            {activeView === 'downloads' && <section className="stack-list"><SectionTitle icon={Download} title="Downloads" value={`${profile.downloads.length} jobs`} />{profile.downloads.map((job) => { const game = gameMap.get(job.gameId); return game ? <DownloadRow key={job.gameId} game={game} job={job} /> : null })}</section>}
            {activeView === 'wishlist' && <section className="catalog-grid">{wishlistGames.map((game) => <GameCard key={game.id} game={game} selected={selectedGame.id === game.id} owned={ownedIds.has(game.id)} inCart={cartIds.has(game.id)} wished={wishlistIds.has(game.id)} onSelect={() => setSelectedGameId(game.id)} onAdd={() => addToCart(game.id)} onWish={() => toggleWishlist(game.id)} onInstall={() => startDownload(game.id)} />)}</section>}
            {activeView === 'community' && <section className="stack-list"><SectionTitle icon={MessageSquare} title="Community" value="Live now" /><article className="event-row"><Trophy size={20} /><div><strong>Circuit Weekend</strong><span>Daily tournaments, creator spotlights, and limited drops.</span></div><button>Follow</button></article><article className="event-row"><Monitor size={20} /><div><strong>Mod Jam Voting</strong><span>37 curated mods approved this week.</span></div><button>Browse</button></article></section>}
          </div>

          <aside className="detail-rail">
            <section className="wallet-panel"><div><span>Wallet</span><strong>{formatCurrency(profile.wallet)}</strong></div><div><span>Rewards</span><strong>{profile.rewards.toLocaleString()}</strong></div></section>
            <section className="selected-panel"><Cover game={selectedGame} large /><h2>{selectedGame.title}</h2><p>{selectedGame.blurb}</p><div className="spec-grid"><span><Star size={15} />{selectedGame.rating.toFixed(1)}</span><span><Download size={15} />{selectedGame.installSize} GB</span><span><Monitor size={15} />{selectedGame.platforms.join(', ')}</span><span><Play size={15} />{selectedGame.players}</span></div></section>
            <section className="cart-panel"><h2><ShoppingCart size={18} /> Cart</h2>{cartGames.length === 0 ? <p>No pending purchases.</p> : <><div className="cart-lines">{cartGames.map((game) => <div key={game.id} className="cart-line"><strong>{game.title}</strong><span>{formatCurrency(game.currentPrice)}</span><button onClick={() => removeFromCart(game.id)} title={`Remove ${game.title}`}><X size={15} /></button></div>)}</div><div className="cart-totals"><span>Subtotal <strong>{formatCurrency(profile.cartTotals.subtotal)}</strong></span><span>Discounts <strong>-{formatCurrency(profile.cartTotals.discounts)}</strong></span><span>Total <strong>{formatCurrency(profile.cartTotals.total)}</strong></span></div><button className="checkout-button" onClick={checkout} disabled={busyKey === 'checkout'}><CreditCard size={18} /> Checkout</button></>}</section>
          </aside>
        </section>
      </section>
    </main>
  )
}

function GameCard({ game, selected, owned, inCart, wished, onSelect, onAdd, onWish, onInstall }: { game: Game; selected: boolean; owned: boolean; inCart: boolean; wished: boolean; onSelect: () => void; onAdd: () => void; onWish: () => void; onInstall: () => void }) {
  return (
    <article className={clsx('game-card', selected && 'selected')} onClick={onSelect}>
      <Cover game={game} />
      <div className="game-body">
        <div className="game-head"><div><strong>{game.title}</strong><span>{game.studio}</span></div><button onClick={(event) => { event.stopPropagation(); onWish() }}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button></div>
        <p>{game.blurb}</p>
        <div className="tag-list">{game.genres.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="game-footer"><span><Star size={15} /> {game.rating.toFixed(1)}</span><button onClick={(event) => { event.stopPropagation(); if (owned) { onInstall() } else { onAdd() } }} disabled={inCart}>{owned ? 'Install' : inCart ? 'In cart' : formatCurrency(game.currentPrice)}</button></div>
      </div>
    </article>
  )
}

function Cover({ game, large = false }: { game: Game; large?: boolean }) {
  return <div className={clsx('cover', large && 'large')} style={{ '--accent': game.accent, '--secondary': game.secondary } as CSSProperties}><span>{game.status}</span><Gamepad2 size={large ? 34 : 28} /></div>
}

function List({ title, items, onInstall, downloadMap }: { title: string; items: Array<{ game: Game; meta: string; action: string }>; onInstall: (gameId: string) => void; downloadMap: Map<string, DownloadJob> }) {
  return <section className="stack-list"><SectionTitle icon={Library} title={title} value={`${items.length} owned`} />{items.map(({ game, meta }) => <article key={game.id} className="library-row"><Cover game={game} /><div><strong>{game.title}</strong><span>{meta}</span></div><div><span>{downloadMap.get(game.id)?.status ?? 'Not installed'}</span><progress value={downloadMap.get(game.id)?.progress ?? 0} max={100} /></div><button onClick={() => onInstall(game.id)}>Install</button></article>)}</section>
}

function DownloadRow({ game, job }: { game: Game; job: DownloadJob }) {
  return <article className="download-row"><Cover game={game} /><div><strong>{game.title}</strong><span>{job.speed}</span><progress value={job.progress} max={100} /></div><div><strong>{job.progress}%</strong><span>{job.etaMinutes ? `${job.etaMinutes}m` : 'Ready'}</span></div></article>
}

function SectionTitle({ icon: Icon, title, value }: { icon: typeof Compass; title: string; value: string }) {
  return <div className="section-title"><div><Icon size={19} /><h2>{title}</h2></div><span>{value}</span></div>
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'The request failed.')
  return payload as T
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
}

export default App
