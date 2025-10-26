declare namespace NodeJS {
  interface ProcessEnv {
    DIST: string
    VITE_PUBLIC: string
    VITE_DEV_SERVER_URL?: string
    OPEN_DEVTOOLS?: string
  }
}

interface Window {
  electronAPI: {
    onMainMessage: (callback: (value: string) => void) => void
  }
}

