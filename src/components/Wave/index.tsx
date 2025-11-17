import { useEffect, useRef } from 'react'
import './index.css'

interface WaveProps {
  amplitude: number
  wavelength: number
  phase: number
}

const Wave = ({ amplitude, wavelength, phase }: WaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawWave()
    }

    const drawWave = () => {
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2
      const radius = wavelength / 4

      ctx.clearRect(0, 0, width, height)

      // Draw the wave
      ctx.beginPath()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3

      // Start position accounting for phase
      let x = -phase
      let isGoingUp = true

      // Find first visible point
      while (x < 0) {
        x += wavelength / 2
        isGoingUp = !isGoingUp
      }

      // Move to starting position
      if (isGoingUp) {
        ctx.moveTo(x, centerY + amplitude)
      } else {
        ctx.moveTo(x, centerY - amplitude)
      }

      // Draw repeating wave pattern
      while (x < width) {
        if (isGoingUp) {
          // Vertical rise
          ctx.lineTo(x, centerY - amplitude)

          // Circular arc at the top (moving right)
          const arcWidth = Math.min(radius * 2, wavelength / 2)
          ctx.arc(
            x + arcWidth / 2,
            centerY - amplitude,
            arcWidth / 2,
            Math.PI,
            0,
            false // clockwise to go over the top
          )
          x += arcWidth

          // Vertical fall (if there's room for it)
          const fallX = x + (wavelength / 2 - arcWidth)
          ctx.lineTo(fallX, centerY - amplitude)
          ctx.lineTo(fallX, centerY + amplitude)
          x = fallX

          isGoingUp = false
        } else {
          // Already at bottom, draw circular arc at the bottom
          const arcWidth = Math.min(radius * 2, wavelength / 2)
          ctx.arc(
            x + arcWidth / 2,
            centerY + amplitude,
            arcWidth / 2,
            Math.PI,
            0,
            true // counterclockwise to go under the bottom
          )
          x += arcWidth

          // Vertical rise (if there's room for it)
          const riseX = x + (wavelength / 2 - arcWidth)
          ctx.lineTo(riseX, centerY + amplitude)
          ctx.lineTo(riseX, centerY - amplitude)
          x = riseX

          isGoingUp = true
        }
      }

      ctx.stroke()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [amplitude, wavelength, phase])

  return (
    <div className="wave">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Wave
