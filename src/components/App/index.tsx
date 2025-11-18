import { useState } from 'react'
import Controls from '../Controls'
import './index.css'
import Wave from '../Wave'

function App() {

  const DEFAULT_VALUES = {
    isDarkMode: true,
    amplitude: 150,
    wavelength: 200,
    speed: 1.2,
    cycles: 2.5,
    thickness: 50,
  };

  const [isDarkMode, setIsDarkMode] = useState(DEFAULT_VALUES.isDarkMode)
  const [amplitude, setAmplitude] = useState(DEFAULT_VALUES.amplitude)
  const [wavelength, setWavelength] = useState(DEFAULT_VALUES.wavelength)
  const [speed, setSpeed] = useState(DEFAULT_VALUES.speed)
  const [cycles, setCycles] = useState(DEFAULT_VALUES.cycles)
  const [thickness, setThickness] = useState(DEFAULT_VALUES.thickness)

  const onResetClick = () => {
    setIsDarkMode(DEFAULT_VALUES.isDarkMode)
    setAmplitude(DEFAULT_VALUES.amplitude)
    setWavelength(DEFAULT_VALUES.wavelength)
    setSpeed(DEFAULT_VALUES.speed)
    setCycles(DEFAULT_VALUES.cycles)
    setThickness(DEFAULT_VALUES.thickness)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="controls-container">
        <Controls
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          amplitude={amplitude}
          setAmplitude={setAmplitude}
          wavelength={wavelength}
          setWavelength={setWavelength}
          speed={speed}
          setSpeed={setSpeed}
          cycles={cycles}
          setCycles={setCycles}
          thickness={thickness}
          setThickness={setThickness}
          onResetClick={onResetClick}
        />
      </div>

      <div className="wave-container">
        <Wave
          amplitude={amplitude}
          wavelength={wavelength}
          speed={speed}
          cycles={cycles}
          isDarkMode={isDarkMode}
          thickness={thickness}
        />
      </div>
    </div>
  )
}

export default App

