import * as Switch from '@radix-ui/react-switch'
import { AudioWaveform, RulerDimensionLine, LineSquiggle, Repeat2, Gauge, Moon, Sun, RotateCcw } from 'lucide-react'
import { SliderControl } from './SliderControl'
import { WAVE_BOUNDS, WAVE_CONSTRAINTS } from '../../config/waveConfig'
import type { WaveSettings } from '../../types/wave'
import '../../styles/radix.css'
import './index.css'

interface ControlsProps {
  settings: WaveSettings
  onUpdateSettings: (updates: Partial<Omit<WaveSettings, 'isDarkMode'>>) => void
  onSetDarkMode: (isDarkMode: boolean) => void
  onReset: () => void
}

const Controls = ({ settings, onUpdateSettings, onSetDarkMode, onReset }: ControlsProps) => {
  const minWavelength = Math.max(
    WAVE_BOUNDS.wavelength.min,
    settings.thickness * WAVE_CONSTRAINTS.minWavelengthToThicknessRatio
  )

  const minAmplitude = Math.max(
    WAVE_BOUNDS.amplitude.min,
    WAVE_CONSTRAINTS.minAmplitudeCalculation(settings.wavelength, settings.thickness)
  )

  return (
    <div className="controls">
      <div className="controls-sliders">
        <SliderControl
          id="amplitude"
          label="Amplitude"
          value={settings.amplitude}
          onChange={(amplitude) => onUpdateSettings({ amplitude })}
          min={minAmplitude}
          max={WAVE_BOUNDS.amplitude.max}
          step={WAVE_BOUNDS.amplitude.step}
          icon={AudioWaveform}
        />

        <SliderControl
          id="wavelength"
          label="Wavelength"
          value={settings.wavelength}
          onChange={(wavelength) => onUpdateSettings({ wavelength })}
          min={minWavelength}
          max={WAVE_BOUNDS.wavelength.max}
          step={WAVE_BOUNDS.wavelength.step}
          icon={RulerDimensionLine}
        />

        <SliderControl
          id="thickness"
          label="Thickness"
          value={settings.thickness}
          onChange={(thickness) => onUpdateSettings({ thickness })}
          min={WAVE_BOUNDS.thickness.min}
          max={WAVE_BOUNDS.thickness.max}
          step={WAVE_BOUNDS.thickness.step}
          icon={LineSquiggle}
        />

        <SliderControl
          id="cycles"
          label="Cycles"
          value={settings.cycles}
          onChange={(cycles) => onUpdateSettings({ cycles })}
          min={WAVE_BOUNDS.cycles.min}
          max={WAVE_BOUNDS.cycles.max}
          step={WAVE_BOUNDS.cycles.step}
          decimals={2}
          icon={Repeat2}
        />

        <SliderControl
          id="speed"
          label="Speed"
          value={settings.speed}
          onChange={(speed) => onUpdateSettings({ speed })}
          min={WAVE_BOUNDS.speed.min}
          max={WAVE_BOUNDS.speed.max}
          step={WAVE_BOUNDS.speed.step}
          decimals={1}
          icon={Gauge}
        />
      </div>

      <div className="controls-footer">
        <Switch.Root
          id="darkMode"
          className="switch-root"
          checked={settings.isDarkMode}
          onCheckedChange={onSetDarkMode}
          aria-label="Toggle dark mode"
        >
          <Switch.Thumb className="switch-thumb">
            {settings.isDarkMode ? <Moon size={13} /> : <Sun size={13} />}
          </Switch.Thumb>
        </Switch.Root>

        <button className="reset-icon-button" onClick={onReset} aria-label="Reset settings">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}

export default Controls
