
import './index.css'

interface ControlsProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  amplitude: number
  setAmplitude: (value: number) => void
  wavelength: number
  setWavelength: (value: number) => void
  speed: number
  setSpeed: (value: number) => void
  cycles: number
  setCycles: (value: number) => void
  thickness: number
  setLineThickness: (value: number) => void
}

const Controls = ({
  isDarkMode,
  setIsDarkMode,
  amplitude,
  setAmplitude,
  wavelength,
  setWavelength,
  speed,
  setSpeed,
  cycles,
  setCycles,
  thickness,
  setLineThickness
}: ControlsProps) => {
  return (
    <div className="controls">
      <h2>Controls</h2>

      <div className="control-group checkbox">
        <input
          id="darkMode"
          type="checkbox"
          checked={isDarkMode}
          onChange={(e) => setIsDarkMode(e.target.checked)}
        />
        <label htmlFor="darkMode">
          Dark Mode
        </label>
      </div>

      <div className="control-group">
        <label htmlFor="amplitude">
          Amplitude: {amplitude}
        </label>
        <input
          id="amplitude"
          type="range"
          min="5"
          max="300"
          step="5"
          value={amplitude}
          onChange={(e) => setAmplitude(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="wavelength">
          Wavelength: {wavelength}
        </label>
        <input
          id="wavelength"
          type="range"
          min="10"
          max="500"
          step="5"
          value={wavelength}
          onChange={(e) => setWavelength(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="speed">
          Speed: {speed}
        </label>
        <input
          id="speed"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="cycles">
          Cycles: {cycles}
        </label>
        <input
          id="cycles"
          type="range"
          min="0"
          max="10"
          step="0.25"
          value={cycles}
          onChange={(e) => setCycles(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="thickness">
          Thickness: {thickness}
        </label>
        <input
          id="thickness"
          type="range"
          min="1"
          max="100"
          step="0.5"
          value={thickness}
          onChange={(e) => setLineThickness(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default Controls

