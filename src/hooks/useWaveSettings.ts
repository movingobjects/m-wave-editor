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
    height: DEFAULT_SETTINGS.height,
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

        // Apply validation: height must be at least 0.5x thickness
        const minHeightFromThickness = updates.thickness! * WAVE_CONSTRAINTS.minHeightToThicknessRatio
        if (newSettings.height < minHeightFromThickness) {
          newSettings.height = minHeightFromThickness
        }
      }

      // Apply validation: height must be at least 2/3 of wavelength
      if ('wavelength' in updates) {
        const minHeightFromWavelength = updates.wavelength! * WAVE_CONSTRAINTS.minHeightToWavelengthRatio
        if (newSettings.height < minHeightFromWavelength) {
          newSettings.height = minHeightFromWavelength
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
      height: DEFAULT_SETTINGS.height,
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
