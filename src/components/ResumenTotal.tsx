interface ResumenTotalProps {
  totalGastoReal: number
  totalGastoPendiente: number
  presupuestoObjetivo: number
  cantidadInvitados: number
}

export default function ResumenTotal({
  totalGastoReal,
  totalGastoPendiente,
  presupuestoObjetivo,
  cantidadInvitados,
}: ResumenTotalProps) {
  const diferencia = presupuestoObjetivo - totalGastoReal
  const estado = diferencia >= 0 ? 'Presupuesto restante' : 'Presupuesto excedido'
  const estadoColor =
    diferencia >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'
  const gastoPorInvitado = cantidadInvitados > 0 ? totalGastoReal / cantidadInvitados : null

  return (
    <div className="rounded-[var(--r-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-[0_2px_8px_-6px_rgba(15,23,42,0.12)] sm:p-5">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[hsl(var(--text-muted))] sm:text-xs">
        Resumen
      </h2>
      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-4 md:grid-cols-4">
        <div className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white p-2.5 shadow-[0_2px_6px_-4px_rgba(15,23,42,0.12)] sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
            Gasto real
          </p>
          <p className="mt-1 text-base font-semibold text-[hsl(var(--text))] sm:mt-2 sm:text-2xl">
            ${totalGastoReal.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white p-2.5 shadow-[0_2px_6px_-4px_rgba(15,23,42,0.12)] sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
            Pendiente
          </p>
          <p className="mt-1 text-base font-semibold text-[hsl(var(--text))] sm:mt-2 sm:text-2xl">
            ${totalGastoPendiente.toFixed(2)}
          </p>
        </div>
        <div className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white p-2.5 shadow-[0_2px_6px_-4px_rgba(15,23,42,0.12)] sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
            {estado}
          </p>
          <p className={`mt-1 text-base font-semibold sm:mt-2 sm:text-2xl ${estadoColor}`}>
            {diferencia >= 0 ? '+' : '-'}${Math.abs(diferencia).toFixed(2)}
          </p>
        </div>
        <div className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white p-2.5 shadow-[0_2px_6px_-4px_rgba(15,23,42,0.12)] sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[hsl(var(--text-muted))] sm:text-xs sm:tracking-[0.2em]">
            Por invitado
          </p>
          <p className="mt-1 text-base font-semibold text-[hsl(var(--text))] sm:mt-2 sm:text-2xl">
            {gastoPorInvitado === null ? '-' : `$${gastoPorInvitado.toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  )
}
