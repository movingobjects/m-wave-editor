import { useState } from 'react'
import SineWave from '../SineWave'
import Controls from '../Controls'
import './index.css'

export interface WaveConfig {
  amplitude: number
  wavelength: number
  cycles: number
  speed: number
  lineWidth: number
  squareness: number
}

function App() {
  const [waveConfig, setWaveConfig] = useState<WaveConfig>({
    amplitude: 200,
    wavelength: 200,
    cycles: 2.5,
    speed: 0.1,
    lineWidth: 25,
    squareness: 1,
  })

  const [isDarkMode, setIsDarkMode] = useState(true)

  const updateConfig = (key: keyof WaveConfig, value: number | string) => {
    setWaveConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="controls-container">
        <Controls
          config={waveConfig}
          updateConfig={updateConfig}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>

      <div className="wave-container">
        <SineWave config={waveConfig} isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

export default App

