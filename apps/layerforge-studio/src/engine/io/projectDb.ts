import type { BlendMode, Transform2D } from '../document/LayerModel'

export type StoredLayer = {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  transform: Transform2D
  blob: Blob
}

export type StoredSelection = {
  width: number
  height: number
  bounds: { x: number; y: number; width: number; height: number }
  alpha: Uint8ClampedArray
} | null

export type StoredProject = {
  format: 'layerforge-project'
  version: '1.0.0'
  id: string
  name: string
  width: number
  height: number
  dpi: number
  colorMode: 'rgba8'
  backgroundColor: string
  activeLayerId: string | null
  selection: StoredSelection
  layers: StoredLayer[]
  createdAt: string
  updatedAt: string
  savedAt: string
}

export type RecentProject = {
  id: string
  name: string
  width: number
  height: number
  updatedAt: string
  savedAt: string
  layerCount: number
}

const dbName = 'layerforge-studio'
const dbVersion = 1
const projectStore = 'projects'

export function openProjectDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(projectStore)) {
        db.createObjectStore(projectStore, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB is not available.'))
  })
}

export async function putStoredProject(project: StoredProject): Promise<void> {
  const db = await openProjectDb()
  await requestTransaction(db, 'readwrite', (store) => store.put(project))
  db.close()
}

export async function getStoredProject(projectId: string): Promise<StoredProject | null> {
  const db = await openProjectDb()
  const project = await requestTransaction<StoredProject | undefined>(db, 'readonly', (store) => store.get(projectId))
  db.close()
  return project ?? null
}

export async function getStoredProjects(): Promise<StoredProject[]> {
  const db = await openProjectDb()
  const projects = await requestTransaction<StoredProject[]>(db, 'readonly', (store) => store.getAll())
  db.close()
  return projects
}

function requestTransaction<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(projectStore, mode)
    const store = transaction.objectStore(projectStore)
    const request = action(store)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'))
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed.'))
  })
}
