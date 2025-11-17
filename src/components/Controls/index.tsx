
import './index.css'

interface ControlsProps {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  amplitude: number
  setAmplitude: (value: number) => void
  wavelength: number
  setWavelength: (value: number) => void
  phase: number
  setPhase: (value: number) => void
}

const Controls = ({
  isDarkMode,
  setIsDarkMode,
  amplitude,
  setAmplitude,
  wavelength,
  setWavelength,
  phase,
  setPhase
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
        <label htmlFor="phase">
          Phase: {phase}
        </label>
        <input
          id="phase"
          type="range"
          min="0"
          max="500"
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default Controls

