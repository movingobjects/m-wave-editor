import { useEffect, useRef } from 'react'
import './index.css'

interface WaveProps {
  amplitude: number
  wavelength: number
  speed: number
  cycles: number
  isDarkMode: boolean
  thickness: number
}

const Wave = ({ amplitude, wavelength, speed, cycles, isDarkMode, thickness }: WaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const normalizedPhaseRef = useRef(0) // Phase as a fraction of wavelength (wavelength-independent)
  const animationFrameRef = useRef<number>()

  // Store wave parameters in refs so animation loop can access current values without restarting
  const paramsRef = useRef({ amplitude, wavelength, speed, cycles, isDarkMode, thickness })

  // Update refs when props change (no animation restart)
  useEffect(() => {
    paramsRef.current = { amplitude, wavelength, speed, cycles, isDarkMode, thickness }
  }, [amplitude, wavelength, speed, cycles, isDarkMode, thickness])

  // Handle canvas resizing independently
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Constants for wave calculation
    const SECTIONS_PER_WAVELENGTH = 4
    const WAVE_SAMPLE_INTERVAL = 1
    const SPEED_SCALE_FACTOR = 100

    /**
     * Normalizes parameter t to position within one wavelength (0 to wavelength)
     * Handles negative values correctly using modulo arithmetic
     */
    const normalizeParameter = (parameterT: number, wavelength: number): number => {
      return ((parameterT % wavelength) + wavelength) % wavelength
    }

    // Parametric functions: both X and Y are functions of parameter t
    // t represents position along the wave curve (not spatial X)
    const getWaveX = (parameterT: number) => {
      const { wavelength } = paramsRef.current
      const radius = wavelength / SECTIONS_PER_WAVELENGTH

      const normalizedT = normalizeParameter(parameterT, wavelength)
      const sectionLength = wavelength / SECTIONS_PER_WAVELENGTH

      if (normalizedT < sectionLength) {
        // Section 1: Vertical rise - X stays at 0
        return 0
      } else if (normalizedT < sectionLength * 2) {
        // Section 2: Top circular arc - X goes from 0 to 2*radius
        const sectionStartT = normalizedT - sectionLength
        const progress = sectionStartT / sectionLength
        const angle = Math.PI * (1 - progress)
        return radius + radius * Math.cos(angle)
      } else if (normalizedT < sectionLength * 3) {
        // Section 3: Vertical fall - X stays at 2*radius
        return 2 * radius
      } else {
        // Section 4: Bottom circular arc - X goes from 2*radius to 4*radius (wavelength)
        const sectionStartT = normalizedT - sectionLength * 3
        const progress = sectionStartT / sectionLength
        const angle = Math.PI * (1 - progress)
        return 3 * radius + radius * Math.cos(angle)
      }
    }

    const getWaveY = (parameterT: number) => {
      const { wavelength, amplitude } = paramsRef.current
      const canvasCenterY = canvas.height / 2
      const radius = wavelength / SECTIONS_PER_WAVELENGTH

      const normalizedT = normalizeParameter(parameterT, wavelength)
      const sectionLength = wavelength / SECTIONS_PER_WAVELENGTH

      if (normalizedT < sectionLength) {
        // Section 1: Vertical rise - Y goes from bottom to top
        const progress = normalizedT / sectionLength
        return canvasCenterY + amplitude - (2 * amplitude * progress)
      } else if (normalizedT < sectionLength * 2) {
        // Section 2: Top circular arc - bulges upward
        const sectionStartT = normalizedT - sectionLength
        const progress = sectionStartT / sectionLength
        const angle = Math.PI * progress
        return canvasCenterY - amplitude - radius * Math.sin(angle)
      } else if (normalizedT < sectionLength * 3) {
        // Section 3: Vertical fall - Y goes from top to bottom
        const progress = (normalizedT - sectionLength * 2) / sectionLength
        return canvasCenterY - amplitude + (2 * amplitude * progress)
      } else {
        // Section 4: Bottom circular arc - bulges downward
        const sectionStartT = normalizedT - sectionLength * 3
        const progress = sectionStartT / sectionLength
        const angle = Math.PI * progress
        return canvasCenterY + amplitude + radius * Math.sin(angle)
      }
    }

    const drawWave = (phase: number) => {
      const { wavelength, cycles, isDarkMode, thickness } = paramsRef.current
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      if (cycles <= 0) return

      // Calculate the total length to draw (in parameter space)
      const totalParameterLength = cycles * wavelength

      // Calculate where to center the wave horizontally on the canvas
      const canvasCenterX = canvasWidth / 2

      // Draw the wave by sampling parameter t
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000'
      ctx.lineWidth = thickness

      let isFirstPoint = true

      // Sample points from phase to phase + totalParameterLength
      for (let parameterT = phase; parameterT <= phase + totalParameterLength; parameterT += WAVE_SAMPLE_INTERVAL) {
        // Get parametric positions (uses modulo internally for repeating pattern)
        const waveXInCycle = getWaveX(parameterT)
        const waveY = getWaveY(parameterT)

        // Calculate absolute X position across multiple cycles
        const cycleNumber = Math.floor(parameterT / wavelength)
        const absoluteWaveX = cycleNumber * wavelength + waveXInCycle

        // Center the wave: shift so the middle of displayed portion is at canvas center
        const canvasX = canvasCenterX + absoluteWaveX - phase - totalParameterLength / 2
        const canvasY = waveY

        // Only draw if within canvas bounds
        if (canvasX >= 0 && canvasX <= canvasWidth) {
          if (isFirstPoint) {
            ctx.moveTo(canvasX, canvasY)
            isFirstPoint = false
          } else {
            ctx.lineTo(canvasX, canvasY)
          }
        }
      }

      ctx.stroke()
    }

    const animate = () => {
      const { wavelength, speed } = paramsRef.current

      // Update normalized phase (wavelength-independent)
      // Increment represents fraction of a wavelength to advance
      normalizedPhaseRef.current += speed / SPEED_SCALE_FACTOR

      // Convert normalized phase to actual phase by multiplying with current wavelength
      const actualPhase = normalizedPhaseRef.current * wavelength

      // Draw the wave with the actual phase
      drawWave(actualPhase)

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="wave">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Wave
