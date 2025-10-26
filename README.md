# M-Wave Tool

A beautiful Electron desktop application featuring a customizable sine wave visualization built with Vite, React, and TypeScript.

## Features

- 🌊 **Real-time Sine Wave Visualization** - Smooth, animated sine wave rendered on HTML5 Canvas
- 🎨 **Fully Customizable** - Adjust amplitude, frequency, phase, speed, color, and line width
- ⚡ **Modern Tech Stack** - Built with Electron, Vite, React, and TypeScript
- 🎯 **Beautiful UI** - Modern dark theme with smooth controls and gradients
- 📱 **Responsive** - Adapts to different window sizes

## Wave Parameters

- **Amplitude**: Controls the height of the wave (10-200)
- **Frequency**: Number of wave cycles across the canvas (0.5-10)
- **Phase Shift**: Initial offset of the wave (0-2π)
- **Animation Speed**: How fast the wave moves (0-0.2)
- **Line Width**: Thickness of the wave line (1-10)
- **Wave Color**: Custom color picker for the wave

## Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Run the app:**

```bash
npm run electron:dev
```

The app will open with a beautiful sine wave visualization that you can customize in real-time!

## Development

Run the app in development mode:

```bash
npm run electron:dev
```

This will start the Vite dev server and launch Electron with hot-reload enabled.

## Building

Build the application for production:

```bash
npm run electron:build
```

This will create distributable packages in the `release` directory for your platform.

## Project Structure

```
m-wave-tool/
├── electron/           # Electron main and preload scripts
│   ├── main.ts        # Main process entry point
│   └── preload.ts     # Preload script for IPC
├── src/               # React application
│   ├── components/    # React components
│   │   ├── SineWave.tsx    # Canvas-based wave visualization
│   │   ├── Controls.tsx    # Control panel for wave parameters
│   │   └── Controls.css    # Control panel styles
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
└── package.json       # Project dependencies and scripts
```

## Technologies

- **Electron** - Desktop application framework
- **Vite** - Fast build tool and dev server
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **HTML5 Canvas** - High-performance wave rendering

## How It Works

The sine wave is rendered using the HTML5 Canvas API with the mathematical formula:

```
y = amplitude × sin(frequency × x + phase + time × speed)
```

The wave is continuously animated using `requestAnimationFrame` for smooth 60fps performance. All parameters can be adjusted in real-time through the control panel.

## License

MIT
