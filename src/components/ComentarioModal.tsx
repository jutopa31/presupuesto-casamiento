interface ComentarioModalProps {
  isOpen: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export default function ComentarioModal({
  isOpen,
  value,
  onChange,
  onClose,
}: ComentarioModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.8)] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Detalles
            </p>
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              Comentarios
            </h3>
          </div>
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <textarea
          className="mt-4 min-h-[160px] w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="Agrega notas..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}
