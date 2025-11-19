import { useEffect, useRef } from 'react'
import './index.css'

// Animation constants
const SECTIONS_PER_WAVELENGTH = 4
const SPEED_SCALE_FACTOR = 100
const SAMPLES_PER_WAVELENGTH = 400
const FPS_NORMALIZATION = 60 // Normalize to 60fps for consistent speed

interface WaveProps {
  height: number
  wavelength: number
  speed: number
  cycles: number
  isDarkMode: boolean
  thickness: number
}

interface SectionBoundaries {
  section1End: number
  section2End: number
  section3End: number
  section4End: number
  totalArcLength: number
  verticalLength: number
  arcLength: number
}

/**
 * Normalizes parameter t to position within one wavelength (0 to wavelength)
 * Handles negative values correctly using modulo arithmetic
 */
const normalizeParameter = (parameterT: number, wavelength: number): number => {
  return ((parameterT % wavelength) + wavelength) % wavelength
}

/**
 * Calculates section boundaries based on arc lengths for constant speed movement
 */
const calculateSectionBoundaries = (wavelength: number, amplitude: number): SectionBoundaries => {
  const radius = wavelength / SECTIONS_PER_WAVELENGTH
  const verticalLength = 2 * amplitude
  const arcLength = Math.PI * radius
  const totalArcLength = 2 * verticalLength + 2 * arcLength

  return {
    section1End: verticalLength,
    section2End: verticalLength + arcLength,
    section3End: 2 * verticalLength + arcLength,
    section4End: totalArcLength,
    totalArcLength,
    verticalLength,
    arcLength,
  }
}

const Wave = ({ height, wavelength, speed, cycles, isDarkMode, thickness }: WaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const normalizedPhaseRef = useRef(0) // Phase as a fraction of wavelength (wavelength-independent)
  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0) // Track last frame timestamp for delta time calculation

  // Store wave parameters in refs so animation loop can access current values without restarting
  const paramsRef = useRef({ height, wavelength, speed, cycles, isDarkMode, thickness })

  // Update refs when props change (no animation restart)
  useEffect(() => {
    paramsRef.current = { height, wavelength, speed, cycles, isDarkMode, thickness }
  }, [height, wavelength, speed, cycles, isDarkMode, thickness])

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

    /**
     * Calculates the X position for a given parameter t
     * Parametric function where both X and Y are functions of parameter t
     */
    const getWaveX = (parameterT: number) => {
      const { wavelength, height, thickness } = paramsRef.current
      const radius = wavelength / SECTIONS_PER_WAVELENGTH
      const effectiveHeight = height - thickness / 2
      const amplitude = (effectiveHeight - 2 * radius) / 2

      const normalizedT = normalizeParameter(parameterT, wavelength)
      const sections = calculateSectionBoundaries(wavelength, amplitude)

      // Map parameter t to actual arc length position
      const arcPosition = (normalizedT / wavelength) * sections.totalArcLength

      if (arcPosition < sections.section1End) {
        // Section 1: Vertical rise - X stays at 0
        return 0
      } else if (arcPosition < sections.section2End) {
        // Section 2: Top circular arc - X goes from 0 to 2*radius
        const sectionProgress = (arcPosition - sections.section1End) / sections.arcLength
        const angle = Math.PI * (1 - sectionProgress)
        return radius + radius * Math.cos(angle)
      } else if (arcPosition < sections.section3End) {
        // Section 3: Vertical fall - X stays at 2*radius
        return 2 * radius
      } else {
        // Section 4: Bottom circular arc - X goes from 2*radius to 4*radius (wavelength)
        const sectionProgress = (arcPosition - sections.section3End) / sections.arcLength
        const angle = Math.PI * (1 - sectionProgress)
        return 3 * radius + radius * Math.cos(angle)
      }
    }

    /**
     * Calculates the Y position for a given parameter t
     * Parametric function where both X and Y are functions of parameter t
     */
    const getWaveY = (parameterT: number) => {
      const { wavelength, height, thickness } = paramsRef.current
      const canvasCenterY = canvas.height / 2
      const radius = wavelength / SECTIONS_PER_WAVELENGTH
      const effectiveHeight = height - thickness / 2
      const amplitude = (effectiveHeight - 2 * radius) / 2

      const normalizedT = normalizeParameter(parameterT, wavelength)
      const sections = calculateSectionBoundaries(wavelength, amplitude)

      // Map parameter t to actual arc length position
      const arcPosition = (normalizedT / wavelength) * sections.totalArcLength

      if (arcPosition < sections.section1End) {
        // Section 1: Vertical rise - Y goes from bottom to top
        const sectionProgress = arcPosition / sections.verticalLength
        return canvasCenterY + amplitude - (2 * amplitude * sectionProgress)
      } else if (arcPosition < sections.section2End) {
        // Section 2: Top circular arc - bulges upward
        const sectionProgress = (arcPosition - sections.section1End) / sections.arcLength
        const angle = Math.PI * sectionProgress
        return canvasCenterY - amplitude - radius * Math.sin(angle)
      } else if (arcPosition < sections.section3End) {
        // Section 3: Vertical fall - Y goes from top to bottom
        const sectionProgress = (arcPosition - sections.section2End) / sections.verticalLength
        return canvasCenterY - amplitude + (2 * amplitude * sectionProgress)
      } else {
        // Section 4: Bottom circular arc - bulges downward
        const sectionProgress = (arcPosition - sections.section3End) / sections.arcLength
        const angle = Math.PI * sectionProgress
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

      // Calculate adaptive sample interval to ensure smooth curves
      const adaptiveSampleInterval = wavelength / SAMPLES_PER_WAVELENGTH

      // Draw the wave by sampling parameter t
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000'
      ctx.lineWidth = thickness

      let isFirstPoint = true

      // Sample points from phase to phase + totalParameterLength
      // We render beyond the visible canvas bounds to ensure smooth appearance at edges
      for (let parameterT = phase; parameterT <= phase + totalParameterLength; parameterT += adaptiveSampleInterval) {
        // Get parametric positions (uses modulo internally for repeating pattern)
        const waveXInCycle = getWaveX(parameterT)
        const waveY = getWaveY(parameterT)

        // Calculate absolute X position across multiple cycles
        const cycleNumber = Math.floor(parameterT / wavelength)
        const absoluteWaveX = cycleNumber * wavelength + waveXInCycle

        // Center the wave: shift so the middle of displayed portion is at canvas center
        const canvasX = canvasCenterX + absoluteWaveX - phase - totalParameterLength / 2
        const canvasY = waveY

        // Draw all points - canvas will naturally clip anything outside bounds
        if (isFirstPoint) {
          ctx.moveTo(canvasX, canvasY)
          isFirstPoint = false
        } else {
          ctx.lineTo(canvasX, canvasY)
        }
      }

      ctx.stroke()
    }

    const animate = (timestamp: number) => {
      const { wavelength, speed } = paramsRef.current

      // Calculate delta time in seconds
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      // Update normalized phase (wavelength-independent)
      // deltaTime ensures consistent motion regardless of refresh rate
      // Multiply by FPS_NORMALIZATION to maintain consistent speed calibrated to 60fps
      normalizedPhaseRef.current += (speed / SPEED_SCALE_FACTOR) * deltaTime * FPS_NORMALIZATION

      // Convert normalized phase to actual phase by multiplying with current wavelength
      const actualPhase = normalizedPhaseRef.current * wavelength

      drawWave(actualPhase)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    // Reset lastTimeRef to ensure proper delta time calculation on first frame
    lastTimeRef.current = 0
    animationFrameRef.current = requestAnimationFrame(animate)

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
