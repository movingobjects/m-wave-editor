import * as Slider from '@radix-ui/react-slider'

interface SliderControlProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  decimals?: number
}

/**
 * Reusable slider control component
 * Wraps Radix UI slider with consistent styling and label formatting
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
}: SliderControlProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value)

  return (
    <div className="control-group">
      <label htmlFor={id}>
        {label}: <span className="value">{displayValue}</span>
      </label>
      <Slider.Root
        id={id}
        className="slider-root"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      >
        <Slider.Track className="slider-track">
          <Slider.Range className="slider-range" />
        </Slider.Track>
        <Slider.Thumb className="slider-thumb" />
      </Slider.Root>
    </div>
  )
}
