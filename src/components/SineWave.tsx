import { useEffect, useRef } from 'react'
import { WaveConfig } from '../App'

interface SineWaveProps {
  config: WaveConfig
  isDarkMode: boolean
}

const SineWave = ({ config, isDarkMode }: SineWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>()
  const phaseRef = useRef(0)
  const configRef = useRef(config)
  const isDarkModeRef = useRef(isDarkMode)

  // Keep config ref updated
  useEffect(() => {
    configRef.current = config
  }, [config])

  // Keep isDarkMode ref updated
  useEffect(() => {
    isDarkModeRef.current = isDarkMode
  }, [isDarkMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match display size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)

      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      const currentConfig = configRef.current
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const isDark = isDarkModeRef.current

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw center line
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      // Draw sine wave
      ctx.strokeStyle = isDark ? '#fff' : '#000'
      ctx.lineWidth = currentConfig.lineWidth
      ctx.beginPath()

      const centerY = height / 2
      const samplePoints = 1000

      // Calculate total width based on wavelength and number of cycles
      const totalWaveWidth = currentConfig.wavelength * currentConfig.cycles
      const startX = (width - totalWaveWidth) / 2

      // First pass: compute points and approximate arc lengths
      const rawPoints: { x: number; y: number }[] = []
      const arcLengths: number[] = [0]

      for (let i = 0; i <= samplePoints; i++) {
        const t = i / samplePoints
        const angle = (t * currentConfig.cycles) * Math.PI * 2
        const sinValue = Math.sin(angle + phaseRef.current)
        const power = 1 / (1 + currentConfig.squareness * 9)
        const shapedValue = Math.sign(sinValue) * Math.pow(Math.abs(sinValue), power)

        const x = startX + t * totalWaveWidth
        const y = centerY + shapedValue * currentConfig.amplitude

        rawPoints.push({ x, y })

        if (i > 0) {
          const dx = rawPoints[i].x - rawPoints[i - 1].x
          const dy = rawPoints[i].y - rawPoints[i - 1].y
          const segmentLength = Math.sqrt(dx * dx + dy * dy)
          arcLengths.push(arcLengths[i - 1] + segmentLength)
        }
      }

      const totalArcLength = arcLengths[arcLengths.length - 1]

      // Second pass: draw with uniform arc length spacing
      const renderPoints = 500
      for (let i = 0; i <= renderPoints; i++) {
        const targetArcLength = (i / renderPoints) * totalArcLength

        // Find the segment this arc length falls into
        let segmentIndex = 0
        for (let j = 0; j < arcLengths.length - 1; j++) {
          if (arcLengths[j + 1] >= targetArcLength) {
            segmentIndex = j
            break
          }
        }

        // Interpolate within the segment
        const segmentStart = arcLengths[segmentIndex]
        const segmentEnd = arcLengths[segmentIndex + 1]
        const segmentProgress = segmentEnd > segmentStart
          ? (targetArcLength - segmentStart) / (segmentEnd - segmentStart)
          : 0

        const p1 = rawPoints[segmentIndex]
        const p2 = rawPoints[segmentIndex + 1] || p1

        const x = p1.x + (p2.x - p1.x) * segmentProgress
        const y = p1.y + (p2.y - p1.y) * segmentProgress

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      // Update phase for animation
      phaseRef.current += currentConfig.speed

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="sine-wave-canvas" />
}

export default SineWave

