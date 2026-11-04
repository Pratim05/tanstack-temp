export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-1.5 leading-none">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      <p className="text-[15px] text-muted-foreground">{description}</p>
    </div>
  )
}
