interface HeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-primary-800 text-white px-4 py-4 shadow-md">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{title}</h1>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider shadow-sm">
              BieM363
            </span>
          </div>
          {subtitle && <p className="text-primary-200 text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}

