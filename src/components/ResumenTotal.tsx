interface ResumenTotalProps {
  totalCantidad: number
  totalGasto: number
  presupuestoObjetivo: number
}

export default function ResumenTotal({
  totalCantidad,
  totalGasto,
  presupuestoObjetivo,
}: ResumenTotalProps) {
  const diferencia = presupuestoObjetivo - totalGasto
  const estado = diferencia >= 0 ? 'Ahorro' : 'Exceso'
  const estadoColor = diferencia >= 0 ? 'text-emerald-600' : 'text-rose-600'

  return (
    <div className="rounded-3xl border border-amber-100/70 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(120,53,15,0.45)] backdrop-blur">
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700/70">
        Resumen
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Cantidad total
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{totalCantidad} u.</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Gasto total
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            ${totalGasto.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {estado}
          </p>
          <p className={`mt-2 text-2xl font-semibold ${estadoColor}`}>
            {diferencia >= 0 ? '+' : '-'}${Math.abs(diferencia).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
