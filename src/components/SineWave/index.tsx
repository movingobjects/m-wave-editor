import { useEffect, useRef } from 'react'
import { WaveConfig, WaveType } from '../App'

interface SineWaveProps {
  config: WaveConfig
  isDarkMode: boolean
  waveType: WaveType
}

const SineWave = ({ config, isDarkMode, waveType }: SineWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>()
  const phaseRef = useRef(0)
  const configRef = useRef(config)
  const isDarkModeRef = useRef(isDarkMode)
  const waveTypeRef = useRef(waveType)

  // Keep config ref updated
  useEffect(() => {
    configRef.current = config
  }, [config])

  // Keep isDarkMode ref updated
  useEffect(() => {
    isDarkModeRef.current = isDarkMode
  }, [isDarkMode])

  // Keep waveType ref updated
  useEffect(() => {
    waveTypeRef.current = waveType
  }, [waveType])

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
      ctx.strokeStyle = isDark ? '#222' : '#ddd'
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

      const currentWaveType = waveTypeRef.current

      for (let i = 0; i <= samplePoints; i++) {
        const t = i / samplePoints
        let xOffset: number, yValue: number

        if (currentWaveType === 'parametric') {
          // Parametric wave with circular tops/bottoms and vertical sides
          const cornerRadius = currentConfig.wavelength / 4  // Radius of circular arcs
          const leftX = (currentConfig.wavelength - 2 * cornerRadius) / 2  // Left vertical position
          const rightX = leftX + 2 * cornerRadius  // Right vertical position (exactly 2*radius apart)
          const centerX = (leftX + rightX) / 2  // Center for the arcs
          const straightHeight = currentConfig.amplitude - cornerRadius

          // Calculate position: t goes from 0 to 1, spanning all cycles
          const phaseOffset = phaseRef.current / (Math.PI * 2)

          // Map t to the range that covers all cycles
          const tWithPhase = t * currentConfig.cycles + phaseOffset

          // Which cycle index (can be negative due to phase)
          const cycleIndex = Math.floor(tWithPhase)

          // Position within current cycle (0 to 1)
          let cycleT = tWithPhase - cycleIndex
          if (cycleT < 0) cycleT += 1
          if (cycleT > 1) cycleT -= 1

          let xInCycle: number

          if (cycleT < 0.25) {
            // Vertical ascent at left
            const progress = cycleT / 0.25
            xInCycle = leftX
            yValue = -straightHeight + progress * (2 * straightHeight)
          } else if (cycleT < 0.5) {
            // Top arc (semicircle from left to right)
            const progress = (cycleT - 0.25) / 0.25
            const angle = Math.PI + progress * Math.PI // π to 2π (left to right)
            xInCycle = centerX + cornerRadius * Math.cos(angle)
            yValue = straightHeight + cornerRadius * Math.sin(angle)
          } else if (cycleT < 0.75) {
            // Vertical descent at right
            const progress = (cycleT - 0.5) / 0.25
            xInCycle = rightX
            yValue = straightHeight - progress * (2 * straightHeight)
          } else {
            // Bottom arc (semicircle from right to left)
            const progress = (cycleT - 0.75) / 0.25
            const angle = progress * Math.PI // 0 to π (right to left)
            xInCycle = centerX + cornerRadius * Math.cos(angle)
            yValue = -straightHeight + cornerRadius * Math.sin(angle)
          }

          // Calculate the overall x position accounting for cycles
          // The shape spans one wavelength, so position = cycle * wavelength + position_in_cycle
          xOffset = (cycleIndex % currentConfig.cycles) * currentConfig.wavelength + xInCycle
        } else {
          // Sine wave with squareness
          const angle = (t * currentConfig.cycles) * Math.PI * 2
          const sinValue = Math.sin(angle + phaseRef.current)
          const power = 1 / (1 + currentConfig.squareness * 9)
          const shapedValue = Math.sign(sinValue) * Math.pow(Math.abs(sinValue), power)

          xOffset = t * totalWaveWidth
          yValue = shapedValue * currentConfig.amplitude
        }

        const x = startX + xOffset
        const y = centerY - yValue

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

