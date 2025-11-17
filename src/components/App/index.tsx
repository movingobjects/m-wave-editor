import { useState } from 'react'
import Controls from '../Controls'
import './index.css'
import Wave from '../Wave'

function App() {

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [amplitude, setAmplitude] = useState(150)
  const [wavelength, setWavelength] = useState(200)
  const [speed, setSpeed] = useState(1.2)
  const [cycles, setCycles] = useState(2.5)
  const [thickness, setLineThickness] = useState(50)

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
          setLineThickness={setLineThickness}
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

