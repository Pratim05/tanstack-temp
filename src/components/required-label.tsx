export function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      {children} <span className="text-destructive">*</span>
    </div>
  )
}
