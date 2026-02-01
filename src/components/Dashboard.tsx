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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
      <header className="rounded-3xl border border-amber-100/70 bg-gradient-to-br from-[#fff7ec] via-white to-[#fef3c7] p-6 shadow-[0_20px_45px_-30px_rgba(120,53,15,0.45)] backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80">
              Presupuesto de bebidas
            </p>
            <h1 className="font-display text-4xl font-semibold text-slate-900 md:text-5xl">
              Presupuesto Casamiento
            </h1>
            <p className="max-w-xl text-sm text-slate-600">
              Controla cantidades, precios y notas para mantener el gasto bajo control.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-amber-100/80 bg-white/80 px-4 py-2 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Meta
            </label>
            <input
              className="w-32 rounded-full border border-amber-100/70 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
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
          </div>
        </div>
      </header>

      <ResumenTotal
        totalCantidad={totalCantidadValue}
        totalGasto={totalGastoValue}
        presupuestoObjetivo={presupuesto.presupuestoObjetivo}
      />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4">
          <BebidaForm
            key={editing?.id ?? 'nuevo'}
            initialValue={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Filtros
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTROS.map((categoria) => (
                <button
                  key={categoria}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    filter === categoria
                      ? 'border-amber-400 bg-amber-500 text-white shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
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

        <div className="grid gap-4">
          {bebidasFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200/80 bg-white/70 p-10 text-center shadow-[0_18px_40px_-30px_rgba(120,53,15,0.45)]">
              <p className="font-display text-2xl font-semibold text-slate-800">
                Empieza tu lista
              </p>
              <p className="mt-2 text-sm text-slate-600">
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
