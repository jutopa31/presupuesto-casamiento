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
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-semibold text-slate-900">{bebida.nombre}</p>
          <span className="mt-2 inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
            {bebida.categoria}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Cantidad
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{bebida.cantidad} u.</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Precio unitario
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            ${bebida.precioUnitario.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-700">Lugar:</span>{' '}
          {bebida.lugarPrecio || 'Sin especificar'}
        </p>
        {bebida.comentarios ? (
          <p>
            <span className="font-semibold text-slate-700">Notas:</span> {bebida.comentarios}
          </p>
        ) : null}
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        {onShowNotes ? (
          <button
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            type="button"
            onClick={() => onShowNotes(bebida)}
          >
            Notas
          </button>
        ) : null}
        <button
          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          type="button"
          onClick={() => onEdit(bebida)}
        >
          Editar
        </button>
        <button
          className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300"
          type="button"
          onClick={() => onDelete(bebida.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
