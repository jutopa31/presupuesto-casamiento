import { useMemo, useState } from 'react'
import BebidaCard from './BebidaCard'
import BebidaForm from './BebidaForm'
import type { BebidaFormValues } from './BebidaForm'
import ComentarioModal from './ComentarioModal'
import ResumenTotal from './ResumenTotal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Bebida, CategoriaBebida, Presupuesto } from '../types/bebida'
import { totalCantidad, totalGasto } from '../utils/calculations'

const DEFAULT_PRESUPUESTO: Presupuesto = {
  bebidas: [],
  presupuestoObjetivo: 0,
  moneda: 'ARS',
  fechaEvento: new Date(),
  cantidadInvitados: 0,
}

const FILTROS: Array<'todas' | CategoriaBebida> = [
  'todas',
  'destilado',
  'vino',
  'cerveza',
  'sin-alcohol',
  'otro',
]

export default function Dashboard() {
  const [presupuesto, setPresupuesto] = useLocalStorage<Presupuesto>(
    'presupuesto-casamiento',
    DEFAULT_PRESUPUESTO,
  )
  const [editing, setEditing] = useState<Bebida | null>(null)
  const [filter, setFilter] = useState<'todas' | CategoriaBebida>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalComentario, setModalComentario] = useState('')

  const bebidasFiltradas = useMemo(() => {
    if (filter === 'todas') return presupuesto.bebidas
    return presupuesto.bebidas.filter((bebida) => bebida.categoria === filter)
  }, [filter, presupuesto.bebidas])

  function handleSubmit(values: BebidaFormValues) {
    const now = new Date()

    if (editing) {
      setPresupuesto({
        ...presupuesto,
        bebidas: presupuesto.bebidas.map((bebida) =>
          bebida.id === editing.id
            ? { ...editing, ...values, fechaActualizacion: now }
            : bebida,
        ),
      })
      setEditing(null)
      return
    }

    const nuevaBebida: Bebida = {
      id: crypto.randomUUID(),
      ...values,
      fechaActualizacion: now,
    }

    setPresupuesto({
      ...presupuesto,
      bebidas: [nuevaBebida, ...presupuesto.bebidas],
    })
  }

  function handleDelete(id: string) {
    setPresupuesto({
      ...presupuesto,
      bebidas: presupuesto.bebidas.filter((bebida) => bebida.id !== id),
    })
  }

  const totalCantidadValue = totalCantidad(presupuesto.bebidas)
  const totalGastoValue = totalGasto(presupuesto.bebidas)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:gap-6 sm:px-6">
      <header className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-4 shadow-[0_16px_40px_-32px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted)] sm:text-xs">
              Presupuesto de bebidas
            </p>
            <h1 className="font-display text-2xl font-semibold text-[color:var(--ink)] sm:text-4xl md:text-5xl">
              Presupuesto Casamiento
            </h1>
            <p className="max-w-xl text-xs text-[color:var(--muted)] sm:text-sm">
              Controla cantidades, precios y notas con un tablero claro y minimalista.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-3 lg:max-w-md">
            <label className="flex flex-col gap-1 rounded-2xl border border-[color:var(--line)] bg-white px-3 py-2 shadow-[0_8px_24px_-18px_rgba(26,26,26,0.4)]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Presupuesto
              </span>
              <input
                className="w-full bg-transparent text-sm font-semibold text-[color:var(--ink)] focus:outline-none"
                type="number"
                min={0}
                value={presupuesto.presupuestoObjetivo}
                onChange={(event) =>
                  setPresupuesto({
                    ...presupuesto,
                    presupuestoObjetivo: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="flex flex-col gap-1 rounded-2xl border border-[color:var(--line)] bg-white px-3 py-2 shadow-[0_8px_24px_-18px_rgba(26,26,26,0.4)]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Invitados
              </span>
              <input
                className="w-full bg-transparent text-sm font-semibold text-[color:var(--ink)] focus:outline-none"
                type="number"
                min={0}
                value={presupuesto.cantidadInvitados}
                onChange={(event) =>
                  setPresupuesto({
                    ...presupuesto,
                    cantidadInvitados: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
        </div>
      </header>

      <ResumenTotal
        totalCantidad={totalCantidadValue}
        totalGasto={totalGastoValue}
        presupuestoObjetivo={presupuesto.presupuestoObjetivo}
        cantidadInvitados={presupuesto.cantidadInvitados}
      />

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4">
          <BebidaForm
            key={editing?.id ?? 'nuevo'}
            initialValue={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-3 shadow-[0_12px_30px_-24px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] sm:text-xs">
              Filtros
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
              {FILTROS.map((categoria) => (
                <button
                  key={categoria}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition sm:px-3 sm:py-1 sm:text-xs ${
                    filter === categoria
                      ? 'border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--bone)] shadow-sm'
                      : 'border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]'
                  }`}
                  type="button"
                  onClick={() => setFilter(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {bebidasFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--panel)] p-6 text-center shadow-[0_18px_40px_-30px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-10">
              <p className="font-display text-xl font-semibold text-[color:var(--ink)] sm:text-2xl">
                Empieza tu lista
              </p>
              <p className="mt-1.5 text-xs text-[color:var(--muted)] sm:mt-2 sm:text-sm">
                No hay bebidas cargadas. Agrega la primera en el formulario.
              </p>
            </div>
          ) : (
            bebidasFiltradas.map((bebida) => (
              <BebidaCard
                key={bebida.id}
                bebida={bebida}
                onEdit={(item) => setEditing(item)}
                onDelete={handleDelete}
                onShowNotes={(item) => {
                  setModalComentario(item.comentarios || '')
                  setIsModalOpen(true)
                }}
              />
            ))
          )}
        </div>
      </section>

      <ComentarioModal
        isOpen={isModalOpen}
        value={modalComentario}
        onChange={setModalComentario}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
