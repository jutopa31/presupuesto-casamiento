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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-h-[85vh] overflow-auto rounded-t-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-[0_25px_60px_-30px_rgba(26,26,26,0.8)] sm:max-w-md sm:rounded-3xl sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] sm:text-xs">
              Detalles
            </p>
            <h3 className="font-display text-xl font-semibold text-[hsl(var(--text))] sm:text-2xl">
              Comentarios
            </h3>
          </div>
          <button
            className="rounded-full border border-[hsl(var(--border))] bg-white px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] sm:px-3 sm:text-xs"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <textarea
          className="mt-3 min-h-[120px] w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30 sm:mt-4 sm:min-h-[160px] sm:rounded-2xl"
          placeholder="Agrega notas..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}


