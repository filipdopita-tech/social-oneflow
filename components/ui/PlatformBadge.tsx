'use client'

const platformConfig: Record<string, { color: string; bg: string; short: string }> = {
  instagram: { color: '#E1306C', bg: 'rgba(225, 48, 108, 0.15)', short: 'IG' },
  linkedin: { color: '#0A66C2', bg: 'rgba(10, 102, 194, 0.15)', short: 'LI' },
  tiktok: { color: '#F0F0FF', bg: 'rgba(240, 240, 255, 0.1)', short: 'TT' },
  facebook: { color: '#1877F2', bg: 'rgba(24, 119, 242, 0.15)', short: 'FB' },
  youtube: { color: '#FF0000', bg: 'rgba(255, 0, 0, 0.15)', short: 'YT' },
  pinterest: { color: '#E60023', bg: 'rgba(230, 0, 35, 0.15)', short: 'PT' },
}

interface PlatformBadgeProps {
  platform: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function PlatformBadge({ platform, size = 'sm', showLabel = false }: PlatformBadgeProps) {
  const config = platformConfig[platform.toLowerCase()] || { color: '#7B7B9A', bg: 'rgba(123, 123, 154, 0.15)', short: platform.slice(0, 2).toUpperCase() }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-md',
    md: 'text-xs px-2 py-1 rounded-lg',
    lg: 'text-sm px-3 py-1.5 rounded-xl',
  }

  return (
    <span
      className={`font-semibold inline-flex items-center gap-1 ${sizeClasses[size]}`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.short}
      {showLabel && <span className="capitalize">{platform}</span>}
    </span>
  )
}
