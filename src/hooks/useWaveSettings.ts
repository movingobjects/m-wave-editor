import { useState, useCallback } from 'react'
import { DEFAULT_SETTINGS, WAVE_CONSTRAINTS } from '../config/waveConfig'
import type { WaveSettings, UseWaveSettingsReturn } from '../types/wave'

/**
 * Custom hook for managing wave settings state and validation
 * Encapsulates all wave parameters and their constraints
 */
export function useWaveSettings(): UseWaveSettingsReturn {
  const [settings, setSettings] = useState<WaveSettings>({
    isDarkMode: DEFAULT_SETTINGS.isDarkMode,
    amplitude: DEFAULT_SETTINGS.amplitude,
    wavelength: DEFAULT_SETTINGS.wavelength,
    speed: DEFAULT_SETTINGS.speed,
    cycles: DEFAULT_SETTINGS.cycles,
    thickness: DEFAULT_SETTINGS.thickness,
  })

  const updateSettings = useCallback((updates: Partial<Omit<WaveSettings, 'isDarkMode'>>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates }

      // Apply validation: wavelength must be at least 2x thickness
      if ('thickness' in updates) {
        const minWavelength = updates.thickness! * WAVE_CONSTRAINTS.minWavelengthToThicknessRatio
        if (newSettings.wavelength < minWavelength) {
          newSettings.wavelength = minWavelength
        }
      }

      return newSettings
    })
  }, [])

  const setDarkMode = useCallback((isDarkMode: boolean) => {
    setSettings((prev) => ({ ...prev, isDarkMode }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({
      isDarkMode: DEFAULT_SETTINGS.isDarkMode,
      amplitude: DEFAULT_SETTINGS.amplitude,
      wavelength: DEFAULT_SETTINGS.wavelength,
      speed: DEFAULT_SETTINGS.speed,
      cycles: DEFAULT_SETTINGS.cycles,
      thickness: DEFAULT_SETTINGS.thickness,
    })
  }, [])

  return {
    settings,
    updateSettings,
    setDarkMode,
    resetSettings,
  }
}
