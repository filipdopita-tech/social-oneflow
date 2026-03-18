export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-[#6B5BFF] to-[#00D9FF] bg-clip-text text-transparent ${className ?? ''}`}>
      {children}
    </span>
  )
}
