import * as Switch from '@radix-ui/react-switch'
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

  return (
    <div className="controls">
      <h2>m wave</h2>

      <SliderControl
        id="height"
        label="Height"
        value={settings.height}
        onChange={(height) => onUpdateSettings({ height })}
        min={WAVE_BOUNDS.height.min}
        max={WAVE_BOUNDS.height.max}
        step={WAVE_BOUNDS.height.step}
      />

      <SliderControl
        id="wavelength"
        label="Wavelength"
        value={settings.wavelength}
        onChange={(wavelength) => onUpdateSettings({ wavelength })}
        min={minWavelength}
        max={WAVE_BOUNDS.wavelength.max}
        step={WAVE_BOUNDS.wavelength.step}
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
      />

      <SliderControl
        id="thickness"
        label="Thickness"
        value={settings.thickness}
        onChange={(thickness) => onUpdateSettings({ thickness })}
        min={WAVE_BOUNDS.thickness.min}
        max={WAVE_BOUNDS.thickness.max}
        step={WAVE_BOUNDS.thickness.step}
        decimals={1}
      />

      <div className="control-group">
        <label htmlFor="darkMode" className="switch-label">
          Dark Mode
        </label>
        <Switch.Root
          id="darkMode"
          className="switch-root"
          checked={settings.isDarkMode}
          onCheckedChange={onSetDarkMode}
        >
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
      </div>

      <button className="reset" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

export default Controls
