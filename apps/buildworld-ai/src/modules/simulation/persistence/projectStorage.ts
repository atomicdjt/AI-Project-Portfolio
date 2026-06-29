import type { ProjectExport, SimulationProject } from '../../../types/simulation'

const storageKey = 'buildworld-ai-project'

export const exportProject = (project: SimulationProject): string =>
  JSON.stringify(
    {
      ...project,
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
    } satisfies ProjectExport,
    null,
    2,
  )

export const importProject = (payload: string): SimulationProject => {
  const parsed = JSON.parse(payload) as ProjectExport
  if (parsed.schemaVersion !== 1) {
    throw new Error('Unsupported BuildWorld AI project schema.')
  }
  if (!parsed.activeScenario?.nodes?.length || !parsed.activeScenario?.edges) {
    throw new Error('Project export is missing a valid scenario graph.')
  }
  return {
    id: parsed.id,
    name: parsed.name,
    activeScenario: parsed.activeScenario,
    snapshots: parsed.snapshots ?? [],
    updatedAt: parsed.updatedAt ?? parsed.exportedAt,
  }
}

export const saveProjectLocally = (project: SimulationProject): void => {
  window.localStorage.setItem(storageKey, exportProject(project))
}

export const loadProjectLocally = (): SimulationProject | undefined => {
  const payload = window.localStorage.getItem(storageKey)
  return payload ? importProject(payload) : undefined
}

export const clearLocalProject = (): void => {
  window.localStorage.removeItem(storageKey)
}
