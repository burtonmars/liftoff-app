export function calculateBurdenScore(
  mentalRent: number,
  reliefFactor: number,
  dreadLevel: number,
  createdAt: Date
): number {
  const base = mentalRent * 0.4 + reliefFactor * 0.35 + dreadLevel * 0.25;
  const daysOld = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const ageBonus = Math.log2(daysOld + 1) * 3;
  return Math.min(100, Math.max(1, Math.round(base * 10 + ageBonus)));
}

export function calculateCategoryHealth(burdenScores: number[]): number {
  const MAX_BURDEN = 500;
  const total = burdenScores.reduce((sum, s) => sum + s, 0);
  return Math.max(0, Math.round(100 - (total / MAX_BURDEN) * 100));
}
