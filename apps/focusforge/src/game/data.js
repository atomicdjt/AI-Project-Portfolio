// Civilization tiers are unlocked by cumulative gold earned across all sessions.
export const CIVILIZATIONS = [
  { name: 'Hamlet', threshold: 0 },
  { name: 'Village', threshold: 500 },
  { name: 'Town', threshold: 2_000 },
  { name: 'City', threshold: 6_000 },
  { name: 'Kingdom', threshold: 15_000 },
  { name: 'Empire', threshold: 40_000 },
];

// Building rates and costs preserve the supplied FocusForge reference balance.
export const BUILDINGS = {
  farm: {
    name: 'Farm',
    icon: 'Wheat',
    cost: 50,
    goldPerSecond: 2 / 60,
    researchPerSecond: 0,
    max: 10,
    description: 'Grain sustains your people.',
    unlockTech: null,
  },
  mine: {
    name: 'Mine',
    icon: 'Pickaxe',
    cost: 150,
    goldPerSecond: 5 / 60,
    researchPerSecond: 0,
    max: 8,
    description: 'Ore fuels the economy.',
    unlockTech: 'mining',
  },
  library: {
    name: 'Library',
    icon: 'ScrollText',
    cost: 200,
    goldPerSecond: 0,
    researchPerSecond: 3 / 60,
    max: 5,
    description: 'Knowledge is power.',
    unlockTech: 'scholar',
  },
  market: {
    name: 'Market',
    icon: 'Store',
    cost: 300,
    goldPerSecond: 8 / 60,
    researchPerSecond: 1 / 60,
    max: 6,
    description: 'Trade drives prosperity.',
    unlockTech: 'commerce',
  },
  barracks: {
    name: 'Barracks',
    icon: 'Shield',
    cost: 400,
    goldPerSecond: 0,
    researchPerSecond: 0,
    max: 4,
    description: 'Reduces disaster severity.',
    unlockTech: 'military',
  },
  temple: {
    name: 'Temple',
    icon: 'Landmark',
    cost: 600,
    goldPerSecond: 3 / 60,
    researchPerSecond: 2 / 60,
    max: 3,
    description: 'Faith inspires the masses.',
    unlockTech: 'theology',
  },
  forge: {
    name: 'Forge',
    icon: 'Flame',
    cost: 800,
    goldPerSecond: 10 / 60,
    researchPerSecond: 0,
    max: 3,
    description: 'Master metallurgy.',
    unlockTech: 'metalwork',
  },
  observatory: {
    name: 'Observatory',
    icon: 'Telescope',
    cost: 1_000,
    goldPerSecond: 0,
    researchPerSecond: 8 / 60,
    max: 2,
    description: 'Stars reveal secrets.',
    unlockTech: 'astronomy',
  },
};

// Technology costs, effects, and building unlocks preserve the reference table.
export const TECHNOLOGIES = [
  { id: 'mining', name: 'Mining', icon: 'Pickaxe', cost: 50, description: 'Unlock Mines', unlocks: 'mine', branch: 'industry' },
  { id: 'scholar', name: 'Scholarship', icon: 'ScrollText', cost: 80, description: 'Unlock Libraries', unlocks: 'library', branch: 'knowledge' },
  { id: 'commerce', name: 'Commerce', icon: 'Coins', cost: 120, description: 'Unlock Markets', unlocks: 'market', branch: 'industry' },
  { id: 'military', name: 'Military', icon: 'Shield', cost: 150, description: 'Unlock Barracks', unlocks: 'barracks', branch: 'defense' },
  { id: 'theology', name: 'Theology', icon: 'Landmark', cost: 200, description: 'Unlock Temples', unlocks: 'temple', branch: 'knowledge' },
  { id: 'metalwork', name: 'Metallurgy', icon: 'Flame', cost: 300, description: 'Unlock Forges', unlocks: 'forge', branch: 'industry' },
  { id: 'astronomy', name: 'Astronomy', icon: 'Telescope', cost: 400, description: 'Unlock Observatories', unlocks: 'observatory', branch: 'knowledge' },
  { id: 'economics', name: 'Economics', icon: 'TrendingUp', cost: 500, description: 'Double all gold income', effect: 'gold-x2', branch: 'mastery' },
  { id: 'resilience', name: 'Resilience', icon: 'ShieldCheck', cost: 350, description: 'Halve all disaster damage', effect: 'damage-half', branch: 'defense' },
  { id: 'efficiency', name: 'Efficiency', icon: 'Zap', cost: 250, description: 'Double research generation', effect: 'research-x2', branch: 'mastery' },
];

// Distractions fire when an active timer loses page visibility.
export const DISASTERS = [
  { id: 'raid', name: 'Barbarian Raid', icon: 'Swords', color: '#ef5b5b', description: 'Raiders storm the gate while you were absent!', loss: 0.25, destroysBuilding: false },
  { id: 'fire', name: 'Great Fire', icon: 'Flame', color: '#f9733f', description: 'Flames consume the district unchecked!', loss: 0.2, destroysBuilding: true },
  { id: 'plague', name: 'Black Plague', icon: 'Skull', color: '#b879ff', description: 'Disease sweeps through your unguarded population!', loss: 0.15, destroysBuilding: false },
  { id: 'drought', name: 'Drought', icon: 'Sun', color: '#e9bd46', description: 'The harvest fails as the rains cease!', loss: 0.2, destroysBuilding: false },
  { id: 'tempest', name: 'Tempest', icon: 'CloudLightning', color: '#6aa8ff', description: 'A mighty storm batters your settlement!', loss: 0.15, destroysBuilding: false },
];

// Preset focus lengths from the supplied reference.
export const SESSION_DURATIONS = [15, 25, 45, 60, 90];

// Save schema identifiers keep future migrations isolated from older versions.
export const SAVE_VERSION = 5;
export const SAVE_KEY = 'focusforge:v5';
export const LEGACY_SAVE_KEY = 'ff_v4';

