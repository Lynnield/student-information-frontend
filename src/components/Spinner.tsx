export function Spinner({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 text-sm text-slate-600"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}
