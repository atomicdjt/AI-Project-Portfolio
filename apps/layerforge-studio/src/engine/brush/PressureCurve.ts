export function normalizePressure(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value === 0) {
    return 0.5
  }

  return Math.max(0.05, Math.min(1, value))
}

export function applyPressureCurve(value: number, curve = 0.62): number {
  return Math.pow(Math.max(0.01, Math.min(1, value)), curve)
}
