import type { Plant, PlantCategory } from './types'

type PlantSeed = Omit<Plant, 'depthCm' | 'heightCm' | 'sun' | 'note'> & Partial<Pick<Plant, 'depthCm' | 'heightCm' | 'sun' | 'note'>>

const seeds: PlantSeed[] = [
  { id: 'tomato', name: 'Tomato', category: 'fruits', glyph: 'T', color: '#d75b3f', spacingCm: 46, rowSpacingCm: 91, squareFootDensity: 1, companions: ['basil', 'carrot'], conflicts: ['potato'], note: 'Stake or cage taller varieties.' },
  { id: 'pepper', name: 'Pepper', category: 'fruits', glyph: 'P', color: '#e56a43', spacingCm: 46, rowSpacingCm: 61, squareFootDensity: 1 },
  { id: 'eggplant', name: 'Eggplant', category: 'fruits', glyph: 'E', color: '#76528b', spacingCm: 46, rowSpacingCm: 76, squareFootDensity: 1 },
  { id: 'cucumber', name: 'Cucumber', category: 'fruits', glyph: 'C', color: '#5d8f55', spacingCm: 30, rowSpacingCm: 91, squareFootDensity: 2, note: 'Trellising keeps vines inside the bed.' },
  { id: 'zucchini', name: 'Zucchini', category: 'fruits', glyph: 'Z', color: '#6f9445', spacingCm: 61, rowSpacingCm: 91, squareFootDensity: 1 },
  { id: 'summer-squash', name: 'Summer squash', category: 'fruits', glyph: 'S', color: '#d2a83a', spacingCm: 61, rowSpacingCm: 91, squareFootDensity: 1 },
  { id: 'pumpkin', name: 'Pumpkin', category: 'fruits', glyph: 'Pu', color: '#db8138', spacingCm: 91, rowSpacingCm: 152, squareFootDensity: 1 },
  { id: 'okra', name: 'Okra', category: 'fruits', glyph: 'O', color: '#789648', spacingCm: 46, rowSpacingCm: 91, squareFootDensity: 1 },
  { id: 'lettuce', name: 'Lettuce', category: 'leafy', glyph: 'L', color: '#7daf51', spacingCm: 15, rowSpacingCm: 30, squareFootDensity: 4, sun: 'Sun / part shade' },
  { id: 'spinach', name: 'Spinach', category: 'leafy', glyph: 'Sp', color: '#488f5b', spacingCm: 10, rowSpacingCm: 30, squareFootDensity: 9, sun: 'Sun / part shade' },
  { id: 'kale', name: 'Kale', category: 'leafy', glyph: 'K', color: '#477d65', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1, sun: 'Sun / part shade' },
  { id: 'swiss-chard', name: 'Swiss chard', category: 'leafy', glyph: 'Ch', color: '#b05e67', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1, sun: 'Sun / part shade' },
  { id: 'arugula', name: 'Arugula', category: 'leafy', glyph: 'A', color: '#719553', spacingCm: 10, rowSpacingCm: 30, squareFootDensity: 9, sun: 'Sun / part shade' },
  { id: 'mustard-greens', name: 'Mustard greens', category: 'leafy', glyph: 'M', color: '#809544', spacingCm: 15, rowSpacingCm: 30, squareFootDensity: 4, sun: 'Sun / part shade' },
  { id: 'bok-choy', name: 'Bok choy', category: 'leafy', glyph: 'B', color: '#8db369', spacingCm: 20, rowSpacingCm: 30, squareFootDensity: 4, sun: 'Sun / part shade' },
  { id: 'carrot', name: 'Carrot', category: 'roots', glyph: 'Ca', color: '#df8a3b', spacingCm: 5, rowSpacingCm: 30, squareFootDensity: 16 },
  { id: 'radish', name: 'Radish', category: 'roots', glyph: 'R', color: '#cf5067', spacingCm: 5, rowSpacingCm: 20, squareFootDensity: 16 },
  { id: 'beet', name: 'Beet', category: 'roots', glyph: 'Be', color: '#9f4d66', spacingCm: 8, rowSpacingCm: 30, squareFootDensity: 9 },
  { id: 'turnip', name: 'Turnip', category: 'roots', glyph: 'Tu', color: '#b5869c', spacingCm: 10, rowSpacingCm: 30, squareFootDensity: 9 },
  { id: 'parsnip', name: 'Parsnip', category: 'roots', glyph: 'Pa', color: '#c1a86d', spacingCm: 8, rowSpacingCm: 30, squareFootDensity: 9 },
  { id: 'potato', name: 'Potato', category: 'roots', glyph: 'Po', color: '#9b7654', spacingCm: 30, rowSpacingCm: 76, squareFootDensity: 1, conflicts: ['tomato'] },
  { id: 'sweet-potato', name: 'Sweet potato', category: 'roots', glyph: 'Sw', color: '#ba704e', spacingCm: 30, rowSpacingCm: 91, squareFootDensity: 1 },
  { id: 'broccoli', name: 'Broccoli', category: 'brassicas', glyph: 'Br', color: '#52785c', spacingCm: 46, rowSpacingCm: 76, squareFootDensity: 1 },
  { id: 'cauliflower', name: 'Cauliflower', category: 'brassicas', glyph: 'Cf', color: '#84947a', spacingCm: 46, rowSpacingCm: 76, squareFootDensity: 1 },
  { id: 'cabbage', name: 'Cabbage', category: 'brassicas', glyph: 'Cb', color: '#6f9a62', spacingCm: 46, rowSpacingCm: 76, squareFootDensity: 1 },
  { id: 'brussels-sprouts', name: 'Brussels sprouts', category: 'brassicas', glyph: 'Bs', color: '#54795b', spacingCm: 46, rowSpacingCm: 76, squareFootDensity: 1 },
  { id: 'green-bean', name: 'Bush bean', category: 'legumes', glyph: 'G', color: '#5b9560', spacingCm: 10, rowSpacingCm: 46, squareFootDensity: 9 },
  { id: 'pole-bean', name: 'Pole bean', category: 'legumes', glyph: 'Pb', color: '#40784f', spacingCm: 10, rowSpacingCm: 61, squareFootDensity: 8, note: 'Place a trellis along the bed edge.' },
  { id: 'pea', name: 'Pea', category: 'legumes', glyph: 'Pe', color: '#73a65b', spacingCm: 8, rowSpacingCm: 46, squareFootDensity: 8, sun: 'Sun / part shade' },
  { id: 'onion', name: 'Onion', category: 'alliums', glyph: 'On', color: '#aa7d85', spacingCm: 8, rowSpacingCm: 30, squareFootDensity: 9 },
  { id: 'garlic', name: 'Garlic', category: 'alliums', glyph: 'Ga', color: '#988a74', spacingCm: 10, rowSpacingCm: 30, squareFootDensity: 9 },
  { id: 'leek', name: 'Leek', category: 'alliums', glyph: 'Le', color: '#628878', spacingCm: 15, rowSpacingCm: 30, squareFootDensity: 4 },
  { id: 'scallion', name: 'Scallion', category: 'alliums', glyph: 'Sc', color: '#5e9474', spacingCm: 5, rowSpacingCm: 20, squareFootDensity: 16 },
  { id: 'basil', name: 'Basil', category: 'herbs', glyph: 'Ba', color: '#3f8a57', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1, companions: ['tomato'] },
  { id: 'parsley', name: 'Parsley', category: 'herbs', glyph: 'Pr', color: '#4f8055', spacingCm: 20, rowSpacingCm: 30, squareFootDensity: 4, sun: 'Sun / part shade' },
  { id: 'cilantro', name: 'Cilantro', category: 'herbs', glyph: 'Ci', color: '#658f61', spacingCm: 15, rowSpacingCm: 30, squareFootDensity: 4, sun: 'Sun / part shade' },
  { id: 'dill', name: 'Dill', category: 'herbs', glyph: 'D', color: '#70965a', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1 },
  { id: 'rosemary', name: 'Rosemary', category: 'herbs', glyph: 'Ro', color: '#56796c', spacingCm: 46, rowSpacingCm: 61, squareFootDensity: 1 },
  { id: 'thyme', name: 'Thyme', category: 'herbs', glyph: 'Th', color: '#718066', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1 },
  { id: 'oregano', name: 'Oregano', category: 'herbs', glyph: 'Or', color: '#718957', spacingCm: 30, rowSpacingCm: 46, squareFootDensity: 1 },
  { id: 'sage', name: 'Sage', category: 'herbs', glyph: 'Sa', color: '#738879', spacingCm: 46, rowSpacingCm: 61, squareFootDensity: 1 },
  { id: 'chives', name: 'Chives', category: 'herbs', glyph: 'Ch', color: '#6c8b65', spacingCm: 15, rowSpacingCm: 30, squareFootDensity: 4 },
  { id: 'mint', name: 'Mint', category: 'herbs', glyph: 'Mi', color: '#4d8c6f', spacingCm: 46, rowSpacingCm: 61, squareFootDensity: 1, sun: 'Sun / part shade', note: 'Use a container to limit spreading.' },
]

export const plants: Plant[] = seeds.map((plant) => ({
  depthCm: 0.6,
  heightCm: plant.category === 'herbs' ? 45 : plant.category === 'roots' ? 35 : 75,
  sun: 'Full sun',
  note: 'Follow the seed packet for cultivar-specific timing.',
  ...plant,
}))

const plantMap = new Map(plants.map((plant) => [plant.id, plant]))

export function getPlant(id: string): Plant | undefined {
  return plantMap.get(id)
}

export function searchPlants(query: string, category?: PlantCategory | 'all'): Plant[] {
  const needle = query.trim().toLowerCase()
  return plants.filter((plant) => {
    const matchesCategory = !category || category === 'all' || plant.category === category
    const matchesQuery = !needle || `${plant.name} ${plant.category}`.toLowerCase().includes(needle)
    return matchesCategory && matchesQuery
  })
}

export const plantCategories: Array<{ id: PlantCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'leafy', label: 'Leafy' },
  { id: 'roots', label: 'Roots' },
  { id: 'brassicas', label: 'Brassicas' },
  { id: 'legumes', label: 'Legumes' },
  { id: 'alliums', label: 'Alliums' },
  { id: 'herbs', label: 'Herbs' },
]
