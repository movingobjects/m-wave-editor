import { useWaveSettings } from '../../hooks/useWaveSettings'
import Controls from '../Controls'
import Wave from '../Wave'
import './index.css'

function App() {
  const { settings, updateSettings, setDarkMode, resetSettings } = useWaveSettings()

  return (
    <div className={`app ${settings.isDarkMode ? 'dark' : 'light'}`}>
      <div className="controls-container">
        <Controls
          settings={settings}
          onUpdateSettings={updateSettings}
          onSetDarkMode={setDarkMode}
          onReset={resetSettings}
        />
      </div>

      <div className="wave-container">
        <Wave
          amplitude={settings.amplitude}
          wavelength={settings.wavelength}
          speed={settings.speed}
          cycles={settings.cycles}
          isDarkMode={settings.isDarkMode}
          thickness={settings.thickness}
        />
      </div>
    </div>
  )
}

export default App
