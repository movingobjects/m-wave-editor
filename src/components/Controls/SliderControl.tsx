import * as Slider from '@radix-ui/react-slider'
import type { LucideIcon } from 'lucide-react'

interface SliderControlProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  decimals?: number
  icon?: LucideIcon
}

/**
 * Reusable slider control component
 * Wraps Radix UI slider with consistent styling and 3-column layout
 */
export function SliderControl({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  decimals = 0,
  icon: Icon,
}: SliderControlProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value)

  return (
    <div className="control-group slider-group">
      <div className="slider-icon">
        {Icon && <Icon size={18} />}
      </div>
      <div className="slider-middle">
        <Slider.Root
          id={id}
          className="slider-root"
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          aria-label={label}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" />
        </Slider.Root>
      </div>
      <div className="slider-value">
        {displayValue}
      </div>
    </div>
  )
}
