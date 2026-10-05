export function ComingSoonPage({
  title,
  endpoint,
}: {
  title: string
  endpoint: string
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">
        This module is not implemented yet. It will call the Laravel API at{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
          {endpoint}
        </code>
        . No placeholder records are shown.
      </p>
    </div>
  )
}
