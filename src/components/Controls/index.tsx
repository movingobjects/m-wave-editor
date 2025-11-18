import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import '../../styles/radix.css'
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
  setThickness: (value: number) => void
  onResetClick: () => void
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
  setThickness,
  onResetClick
}: ControlsProps) => {
  return (
    <div className="controls">
      <h2>m wave</h2>

      <div className="control-group">
        <label htmlFor="amplitude">
          Amplitude: <span className="value">{amplitude}</span>
        </label>
        <Slider.Root
          id="amplitude"
          className="slider-root"
          min={5}
          max={300}
          step={5}
          value={[amplitude]}
          onValueChange={(value) => setAmplitude(value[0])}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>

      <div className="control-group">
        <label htmlFor="wavelength">
          Wavelength: <span className="value">{wavelength}</span>
        </label>
        <Slider.Root
          id="wavelength"
          className="slider-root"
          min={10}
          max={500}
          step={5}
          value={[wavelength]}
          onValueChange={(value) => setWavelength(value[0])}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>

      <div className="control-group">
        <label htmlFor="speed">
          Speed: <span className="value">{speed.toFixed(1)}</span>
        </label>
        <Slider.Root
          id="speed"
          className="slider-root"
          min={0}
          max={3}
          step={0.1}
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>

      <div className="control-group">
        <label htmlFor="cycles">
          Cycles: <span className="value">{cycles.toFixed(2)}</span>
        </label>
        <Slider.Root
          id="cycles"
          className="slider-root"
          min={0}
          max={5}
          step={0.25}
          value={[cycles]}
          onValueChange={(value) => setCycles(value[0])}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>

      <div className="control-group">
        <label htmlFor="thickness">
          Thickness: <span className="value">{thickness.toFixed(1)}</span>
        </label>
        <Slider.Root
          id="thickness"
          className="slider-root"
          min={1}
          max={100}
          step={0.5}
          value={[thickness]}
          onValueChange={(value) => setThickness(value[0])}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>

      <div className="control-group">
        <label htmlFor="darkMode" className="switch-label">
          Dark Mode
        </label>
        <Switch.Root
          id="darkMode"
          className="switch-root"
          checked={isDarkMode}
          onCheckedChange={setIsDarkMode}
        >
          <Switch.Thumb className="switch-thumb" />
        </Switch.Root>
      </div>

      <button
        className="reset"
        onClick={onResetClick}>
        Reset
      </button>

    </div>
  )
}

export default Controls

