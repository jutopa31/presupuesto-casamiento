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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-4">
      <div className="w-full max-h-[85vh] overflow-auto rounded-t-[var(--r-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.35)] sm:max-w-md sm:rounded-[var(--r-lg)] sm:p-5">
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
            className="press rounded-full border border-[hsl(var(--border))] bg-white px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition duration-150 ease-[cubic-bezier(.2,.8,.2,1)] hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-3 sm:text-xs"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <textarea
          className="mt-3 min-h-[120px] w-full rounded-[var(--r-sm)] border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-opacity-30 sm:mt-4 sm:min-h-[160px]"
          placeholder="Agrega notas..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}


