# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

M-Wave Editor is an Electron + React + Vite application that visualizes animated sine waves with interactive controls. The app uses a custom parametric wave implementation where the wave shape is divided into four sections (vertical rise, top circular arc, vertical fall, bottom circular arc) to create a distinctive M-shaped waveform.

## Development Commands

### Running the application
- `npm run dev` - Start the development server with hot reload (Vite server on port 5173)
- `npm run debug` - Start development server with DevTools open (sets `OPEN_DEVTOOLS=true`)

### Building
- `npm run build` - Full production build sequence:
  1. TypeScript compilation (`tsc`)
  2. Vite build (creates `dist/` directory)
  3. Electron Builder packaging (creates `release/` directory)

### Distribution outputs
- macOS: DMG file
- Windows: NSIS installer
- Linux: AppImage

## Architecture

### Process Architecture
This is a standard Electron multi-process application:

- **Main Process** (`electron/main.ts`): Creates the BrowserWindow with a frameless window (custom window controls). Handles application lifecycle and window management.
- **Preload Script** (`electron/preload.ts`): Exposes `electronAPI` to the renderer via `contextBridge` for IPC communication. Currently only implements `onMainMessage` callback.
- **Renderer Process** (`src/`): React application running in the Electron window.

### Component Structure

```
src/components/
├── App/           - Root component, manages all state (amplitude, wavelength, speed, etc.)
├── Controls/      - Left sidebar with Radix UI sliders and switches for wave parameters
└── Wave/          - Canvas-based wave visualization using parametric equations
```

### State Management
All state is managed in the `App` component using React `useState` and passed down as props. State includes:
- `isDarkMode`: Theme toggle
- `amplitude`: Wave height (5-300)
- `wavelength`: Distance between cycles (10-500)
- `speed`: Animation speed (0-3)
- `cycles`: Number of wave cycles to display (0-5)
- `thickness`: Line thickness (1-100)

### Wave Rendering Algorithm
The `Wave` component uses a parametric approach where both X and Y are functions of parameter `t`:

1. **One wavelength is divided into 4 equal sections** (each `wavelength / 4` units):
   - Section 1: Vertical rise (X = 0)
   - Section 2: Top circular arc (X = 0 to wavelength/2)
   - Section 3: Vertical fall (X = wavelength/2)
   - Section 4: Bottom circular arc (X = wavelength/2 to wavelength)

2. **Animation**: The `phase` value increments each frame by `speed * (wavelength / 100)`, shifting the wave horizontally.

3. **Drawing**: The wave is sampled at regular `t` intervals, converted to canvas coordinates, and centered on screen.

### TypeScript Configuration
- Target: ES2020
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Module resolution: bundler mode
- JSX: react-jsx (automatic JSX transform)
- Includes both `src` and `electron` directories

### Build Configuration
- **Vite** handles React frontend bundling (output: `dist/`)
- **electron/main.ts** and **electron/preload.ts** are built separately by vite-plugin-electron (output: `dist-electron/`)
- **electron-builder** packages the app using config in `package.json` under `"build"` key

### UI Dependencies
- **Radix UI**: Unstyled accessible components (`@radix-ui/react-slider`, `@radix-ui/react-switch`)
- Radix styles are in `src/styles/radix.css`

## Type Definitions
`electron.d.ts` extends global types:
- `ProcessEnv`: Electron-specific environment variables
- `Window`: Adds `electronAPI` interface for renderer process

## Key Implementation Details

When modifying the wave rendering:
- The parametric functions `getWaveX()` and `getWaveY()` use modulo to create repeating patterns
- `absoluteX` calculation accounts for multiple cycles: `cycleNumber * wavelength + localWaveX`
- Canvas coordinates are centered: `centerOffset + absoluteX - phase - totalLength / 2`
- Animation uses `requestAnimationFrame` and must be cleaned up in the effect cleanup function

When adding new controls:
- Add state to `App` component's `DEFAULT_VALUES` and useState hooks
- Pass state and setter as props to `Controls`
- Add corresponding Radix Slider component in `Controls/index.tsx`
- Update `onResetClick` to include the new parameter
- Pass the parameter to the `Wave` component and add to its dependency array
