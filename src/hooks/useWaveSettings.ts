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

      // Apply validation: height must be at least (wavelength + thickness) / 2
      const minHeight = WAVE_CONSTRAINTS.minHeightCalculation(newSettings.wavelength, newSettings.thickness)
      if (newSettings.height < minHeight) {
        newSettings.height = minHeight
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
