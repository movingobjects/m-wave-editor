import { WaveConfig } from '../App'
import './Controls.css'

interface ControlsProps {
  config: WaveConfig
  updateConfig: (key: keyof WaveConfig, value: number | string) => void
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

const Controls = ({ config, updateConfig, isDarkMode, setIsDarkMode }: ControlsProps) => {
  return (
    <div className="controls">
      <h2>Moving Objects</h2>

      <div className="control-group">
        <label htmlFor="theme">
          Dark Mode
        </label>
        <input
          id="theme"
          type="checkbox"
          checked={isDarkMode}
          onChange={(e) => setIsDarkMode(e.target.checked)}
        />
      </div>

      <div className="control-group">
        <label htmlFor="amplitude">
          Amplitude: <span className="value">{config.amplitude}</span>
        </label>
        <input
          id="amplitude"
          type="range"
          min="10"
          max="200"
          step="1"
          value={config.amplitude}
          onChange={(e) => updateConfig('amplitude', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="wavelength">
          Wavelength: <span className="value">{config.wavelength}</span>
        </label>
        <input
          id="wavelength"
          type="range"
          min="50"
          max="500"
          step="10"
          value={config.wavelength}
          onChange={(e) => updateConfig('wavelength', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="cycles">
          Cycles: <span className="value">{config.cycles.toFixed(1)}</span>
        </label>
        <input
          id="cycles"
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={config.cycles}
          onChange={(e) => updateConfig('cycles', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="squareness">
          Squareness: <span className="value">{config.squareness.toFixed(2)}</span>
        </label>
        <input
          id="squareness"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={config.squareness}
          onChange={(e) => updateConfig('squareness', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="speed">
          Animation Speed: <span className="value">{config.speed.toFixed(3)}</span>
        </label>
        <input
          id="speed"
          type="range"
          min="0"
          max="0.5"
          step="0.005"
          value={config.speed}
          onChange={(e) => updateConfig('speed', Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="lineWidth">
          Line Width: <span className="value">{config.lineWidth}</span>
        </label>
        <input
          id="lineWidth"
          type="range"
          min="1"
          max="25"
          step="0.05"
          value={config.lineWidth}
          onChange={(e) => updateConfig('lineWidth', Number(e.target.value))}
        />
      </div>

    </div>
  )
}

export default Controls

