import type { Bebida } from '../types/bebida'

interface BebidaCardProps {
  bebida: Bebida
  onEdit: (bebida: Bebida) => void
  onDelete: (id: string) => void
  onShowNotes?: (bebida: Bebida) => void
}

export default function BebidaCard({
  bebida,
  onEdit,
  onDelete,
  onShowNotes,
}: BebidaCardProps) {
  const subtotal = bebida.cantidad * bebida.precioUnitario

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-white p-4 shadow-[0_12px_30px_-24px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-semibold text-[hsl(var(--text))] sm:text-2xl">
            {bebida.nombre}
          </p>
          <span className="mt-1.5 inline-flex rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--text-muted))] sm:mt-2 sm:px-3 sm:py-1 sm:text-xs sm:tracking-[0.15em]">
            {bebida.categoria}
          </span>
        </div>
        <div className="flex shrink-0 gap-3 text-right sm:block sm:gap-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
              Cantidad
            </p>
            <p className="mt-0.5 text-base font-semibold text-[hsl(var(--text))] sm:mt-1 sm:text-lg">
              {bebida.cantidad} u.
            </p>
          </div>
          <div className="sm:mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
              P/u
            </p>
            <p className="mt-0.5 text-base font-semibold text-[hsl(var(--text))] sm:mt-1 sm:text-lg">
              ${bebida.precioUnitario.toFixed(2)}
            </p>
          </div>
          <div className="sm:mt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
              Subtotal
            </p>
            <p className="mt-0.5 text-base font-semibold text-[hsl(var(--text))] sm:mt-1 sm:text-lg">
              ${subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-1.5 text-xs text-[hsl(var(--text-muted))] sm:mt-4 sm:gap-2 sm:text-sm md:grid-cols-2">
        <p className="truncate">
          <span className="font-semibold text-[hsl(var(--text))]">Lugar:</span>{' '}
          {bebida.lugarPrecio || 'Sin especificar'}
        </p>
        {bebida.comentarios ? (
          <p className="line-clamp-2">
            <span className="font-semibold text-[hsl(var(--text))]">Notas:</span>{' '}
            {bebida.comentarios}
          </p>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 sm:mt-5 sm:gap-2">
        {onShowNotes ? (
          <button
            className="rounded-full border border-[hsl(var(--border))] bg-white px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] sm:px-3 sm:text-xs"
            type="button"
            onClick={() => onShowNotes(bebida)}
          >
            Notas
          </button>
        ) : null}
        <button
          className="rounded-full border border-[hsl(var(--border))] bg-white px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] sm:px-3 sm:text-xs"
          type="button"
          onClick={() => onEdit(bebida)}
        >
          Editar
        </button>
        <button
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--danger))] transition hover:border-[hsl(var(--danger))] sm:px-3 sm:text-xs"
          type="button"
          onClick={() => onDelete(bebida.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}


