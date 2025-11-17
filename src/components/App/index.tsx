import { useState } from 'react'
import Controls from '../Controls'
import './index.css'
import Wave from '../Wave'

function App() {

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [amplitude, setAmplitude] = useState(100)
  const [wavelength, setWavelength] = useState(200)
  const [phase, setPhase] = useState(0)

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
          phase={phase}
          setPhase={setPhase}
        />
      </div>

      <div className="wave-container">
        <Wave
          amplitude={amplitude}
          wavelength={wavelength}
          phase={phase}
        />
      </div>
    </div>
  )
}

export default App

