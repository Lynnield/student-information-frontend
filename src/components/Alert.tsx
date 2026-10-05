import type { ReactNode } from 'react'

interface AlertProps {
  tone?: 'error' | 'success' | 'info'
  title?: string
  children: ReactNode
}

const toneClasses: Record<NonNullable<AlertProps['tone']>, string> = {
  error: 'border-red-300 bg-red-50 text-red-900',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  info: 'border-sky-300 bg-sky-50 text-sky-900',
}

export function Alert({ tone = 'error', title, children }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-md border px-3 py-2 text-sm ${toneClasses[tone]}`}
    >
      {title ? <p className="font-medium">{title}</p> : null}
      <div className={title ? 'mt-1' : undefined}>{children}</div>
    </div>
  )
}
