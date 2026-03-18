'use client'

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
  sublabel?: string
  showValue?: boolean
}

export default function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#6B5BFF',
  bgColor = 'rgba(255,255,255,0.06)',
  label,
  sublabel,
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  const offset = circumference - progress

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
            transition: 'stroke-dashoffset 0.8s ease',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showValue && (
          <span className="font-bold" style={{ color: '#F0F0FF', fontSize: size * 0.18 }}>
            {value}
          </span>
        )}
        {label && (
          <span style={{ color: '#7B7B9A', fontSize: size * 0.09 }}>{label}</span>
        )}
        {sublabel && (
          <span style={{ color, fontSize: size * 0.08, fontWeight: 600 }}>{sublabel}</span>
        )}
      </div>
    </div>
  )
}
