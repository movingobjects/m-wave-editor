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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    // Parametric functions: both X and Y are functions of parameter t
    // t represents position along the wave curve (not spatial X)
    const getWaveX = (t: number) => {
      const radius = wavelength / 4

      // Normalize t to position within one wavelength (0 to wavelength)
      const normalizedT = ((t % wavelength) + wavelength) % wavelength

      // One wavelength has 4 equal sections
      const sectionLength = wavelength / 4

      if (normalizedT < sectionLength) {
        // Section 1: Vertical rise - X stays at 0
        return 0
      } else if (normalizedT < sectionLength * 2) {
        // Section 2: Top circular arc - X goes from 0 to 2*radius
        const localT = normalizedT - sectionLength
        const progress = localT / sectionLength // 0 to 1
        const angle = Math.PI * (1 - progress) // π to 0 (left to right)
        return radius + radius * Math.cos(angle)
      } else if (normalizedT < sectionLength * 3) {
        // Section 3: Vertical fall - X stays at 2*radius
        return 2 * radius
      } else {
        // Section 4: Bottom circular arc - X goes from 2*radius to 4*radius (wavelength)
        const localT = normalizedT - sectionLength * 3
        const progress = localT / sectionLength // 0 to 1
        const angle = Math.PI * (1 - progress) // π to 0 (left to right)
        return 3 * radius + radius * Math.cos(angle)
      }
    }

    const getWaveY = (t: number) => {
      const centerY = canvas.height / 2
      const radius = wavelength / 4

      // Normalize t to position within one wavelength
      const normalizedT = ((t % wavelength) + wavelength) % wavelength

      // One wavelength has 4 equal sections
      const sectionLength = wavelength / 4

      if (normalizedT < sectionLength) {
        // Section 1: Vertical rise - Y goes from bottom to top
        const progress = normalizedT / sectionLength // 0 to 1
        return centerY + amplitude - (2 * amplitude * progress)
      } else if (normalizedT < sectionLength * 2) {
        // Section 2: Top circular arc - bulges upward
        const localT = normalizedT - sectionLength
        const progress = localT / sectionLength // 0 to 1
        const angle = Math.PI * progress // 0 to π
        return centerY - amplitude - radius * Math.sin(angle)
      } else if (normalizedT < sectionLength * 3) {
        // Section 3: Vertical fall - Y goes from top to bottom
        const progress = (normalizedT - sectionLength * 2) / sectionLength // 0 to 1
        return centerY - amplitude + (2 * amplitude * progress)
      } else {
        // Section 4: Bottom circular arc - bulges downward
        const localT = normalizedT - sectionLength * 3
        const progress = localT / sectionLength // 0 to 1
        const angle = Math.PI * progress // 0 to π
        return centerY + amplitude + radius * Math.sin(angle)
      }
    }

    const drawWave = (phase: number) => {
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      if (cycles <= 0) return

      // Calculate the total length to draw (in t parameter space)
      const totalLength = cycles * wavelength

      // Calculate where to center the wave on the canvas
      const centerOffset = width / 2

      // Draw the wave by sampling t parameter
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000'
      ctx.lineWidth = thickness

      // Sample at regular t intervals for smooth rendering
      const step = 1 // Sample every unit in t-space
      let isFirstPoint = true

      // Sample points from phase to phase + totalLength
      for (let t = phase; t <= phase + totalLength; t += step) {
        // Get parametric positions (uses modulo internally for repeating pattern)
        const localWaveX = getWaveX(t)
        const waveY = getWaveY(t)

        // Calculate absolute X position across multiple cycles
        // Which cycle: floor(t / wavelength), position within cycle: localWaveX
        const cycleNumber = Math.floor(t / wavelength)
        const absoluteX = cycleNumber * wavelength + localWaveX

        // Center the wave: shift so the middle of displayed portion is at canvas center
        const canvasX = centerOffset + absoluteX - phase - totalLength / 2
        const canvasY = waveY

        // Only draw if within canvas bounds
        if (canvasX >= 0 && canvasX <= width) {
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
      // Update normalized phase (wavelength-independent)
      // Increment represents fraction of a wavelength to advance
      normalizedPhaseRef.current += speed / 100

      // Convert normalized phase to actual phase by multiplying with current wavelength
      const actualPhase = normalizedPhaseRef.current * wavelength

      // Draw the wave with the actual phase
      drawWave(actualPhase)

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Start animation
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [amplitude, wavelength, speed, cycles, isDarkMode, thickness])

  return (
    <div className="wave">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Wave
