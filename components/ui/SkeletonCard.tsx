interface Props {
  height?: number
  width?: number | string
  radius?: number
  className?: string
}

export function SkeletonCard({ height = 100, width = 'auto', radius = 18, className = '' }: Props) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{
        margin: '0 20px 14px',
        height,
        width,
        borderRadius: radius,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    />
  )
}
