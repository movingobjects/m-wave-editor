/**
 * Wave configuration constants
 * Defines bounds, steps, and default values for all wave parameters
 */

export interface WaveParameterBounds {
  readonly min: number
  readonly max: number
  readonly step: number
  readonly default: number
}

export const WAVE_BOUNDS = {
  amplitude: { min: 5, max: 300, step: 5, default: 150 },
  wavelength: { min: 5, max: 500, step: 5, default: 200 },
  speed: { min: 0, max: 3, step: 0.1, default: 1.2 },
  cycles: { min: 0, max: 5, step: 0.1, default: 2.5 },
  thickness: { min: 1, max: 100, step: 0.5, default: 50 },
} as const

export const DEFAULT_SETTINGS = {
  isDarkMode: true,
  amplitude: WAVE_BOUNDS.amplitude.default,
  wavelength: WAVE_BOUNDS.wavelength.default,
  speed: WAVE_BOUNDS.speed.default,
  cycles: WAVE_BOUNDS.cycles.default,
  thickness: WAVE_BOUNDS.thickness.default,
} as const

export const WAVE_CONSTRAINTS = {
  // Wavelength must be at least 2x thickness
  minWavelengthToThicknessRatio: 2,
} as const
