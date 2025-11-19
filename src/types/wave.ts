/**
 * Type definitions for wave settings and components
 */

export interface WaveSettings {
  readonly isDarkMode: boolean
  readonly height: number
  readonly wavelength: number
  readonly speed: number
  readonly cycles: number
  readonly thickness: number
}

export type WaveParameter = 'height' | 'wavelength' | 'speed' | 'cycles' | 'thickness'

export interface WaveSettingsActions {
  updateSettings: (updates: Partial<Omit<WaveSettings, 'isDarkMode'>>) => void
  setDarkMode: (isDarkMode: boolean) => void
  resetSettings: () => void
}

export interface UseWaveSettingsReturn extends WaveSettingsActions {
  settings: WaveSettings
}
