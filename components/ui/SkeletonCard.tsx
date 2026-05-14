export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`shimmer rounded-card ${className}`}
      style={{ background: 'rgb(var(--bg-card))' }}
    />
  )
}
