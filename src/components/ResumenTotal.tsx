interface ResumenTotalProps {
  totalCantidad: number
  totalGasto: number
  presupuestoObjetivo: number
  cantidadInvitados: number
}

export default function ResumenTotal({
  totalCantidad,
  totalGasto,
  presupuestoObjetivo,
  cantidadInvitados,
}: ResumenTotalProps) {
  const diferencia = presupuestoObjetivo - totalGasto
  const estado = diferencia >= 0 ? 'Ahorro' : 'Exceso'
  const estadoColor =
    diferencia >= 0 ? 'text-[color:var(--salvia)]' : 'text-[color:var(--vino)]'
  const gastoPorInvitado = cantidadInvitados > 0 ? totalGasto / cantidadInvitados : null

  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-4 shadow-[0_18px_40px_-30px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-6">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--muted)] sm:text-xs">
        Resumen
      </h2>
      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[color:var(--line)] bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.2em]">
            Cantidad
          </p>
          <p className="mt-1 text-base font-semibold text-[color:var(--ink)] sm:mt-2 sm:text-2xl">
            {totalCantidad} u.
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.2em]">
            Gasto
          </p>
          <p className="mt-1 text-base font-semibold text-[color:var(--ink)] sm:mt-2 sm:text-2xl">
            ${totalGasto.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.2em]">
            {estado}
          </p>
          <p className={`mt-1 text-base font-semibold sm:mt-2 sm:text-2xl ${estadoColor}`}>
            {diferencia >= 0 ? '+' : '-'}${Math.abs(diferencia).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--line)] bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-xs sm:tracking-[0.2em]">
            Por invitado
          </p>
          <p className="mt-1 text-base font-semibold text-[color:var(--ink)] sm:mt-2 sm:text-2xl">
            {gastoPorInvitado === null ? '—' : `$${gastoPorInvitado.toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  )
}
