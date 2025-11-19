import { useState, useCallback } from 'react'
import { DEFAULT_SETTINGS, WAVE_CONSTRAINTS } from '../config/waveConfig'
import type { WaveSettings, UseWaveSettingsReturn } from '../types/wave'

/**
 * Custom hook for managing wave settings state and validation
 * Encapsulates all wave parameters and their constraints
 */
export function useWaveSettings(): UseWaveSettingsReturn {
  const [settings, setSettings] = useState<WaveSettings>({ ...DEFAULT_SETTINGS })

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

      // Apply validation: amplitude must be at least (wavelength + thickness) / 2
      const minAmplitude = WAVE_CONSTRAINTS.minAmplitudeCalculation(newSettings.wavelength, newSettings.thickness)
      if (newSettings.amplitude < minAmplitude) {
        newSettings.amplitude = minAmplitude
      }

      return newSettings
    })
  }, [])

  const setDarkMode = useCallback((isDarkMode: boolean) => {
    setSettings((prev) => ({ ...prev, isDarkMode }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS })
  }, [])

  return {
    settings,
    updateSettings,
    setDarkMode,
    resetSettings,
  }
}
