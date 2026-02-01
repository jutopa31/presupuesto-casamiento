import { useEffect, useMemo, useState } from 'react'
import BebidaCard from './BebidaCard'
import BebidaForm from './BebidaForm'
import type { BebidaFormValues } from './BebidaForm'
import ComentarioModal from './ComentarioModal'
import ResumenTotal from './ResumenTotal'
import type { Bebida, CategoriaBebida, Presupuesto } from '../types/bebida'
import { totalCantidad, totalGasto } from '../utils/calculations'
import { supabase } from '../utils/supabaseClient'

const DEFAULT_PRESUPUESTO: Presupuesto = {
  bebidas: [],
  presupuestoObjetivo: 0,
  moneda: 'ARS',
  fechaEvento: null,
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
  const [presupuesto, setPresupuesto] = useState<Presupuesto>(DEFAULT_PRESUPUESTO)
  const [presupuestoId, setPresupuestoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Bebida | null>(null)
  const [filter, setFilter] = useState<'todas' | CategoriaBebida>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalComentario, setModalComentario] = useState('')

  useEffect(() => {
    let isActive = true
    const presupuestoSlug = import.meta.env.VITE_PRESUPUESTO_SLUG ?? 'default'

    async function loadPresupuesto() {
      setIsLoading(true)
      setError(null)

      const { data: presupuestoRow, error: presupuestoError } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('slug', presupuestoSlug)
        .single()

      if (presupuestoError || !presupuestoRow) {
        if (isActive) {
          setError('No se pudo cargar el presupuesto desde Supabase.')
          setIsLoading(false)
        }
        return
      }

      const { data: bebidasRows, error: bebidasError } = await supabase
        .from('bebidas')
        .select('*')
        .eq('presupuesto_id', presupuestoRow.id)
        .order('created_at', { ascending: false })

      if (!isActive) return

      if (bebidasError) {
        setError('No se pudieron cargar las bebidas.')
        setIsLoading(false)
        return
      }

      const bebidas = (bebidasRows ?? []).map((row) => ({
        id: row.id as string,
        nombre: row.nombre as string,
        categoria: row.categoria as CategoriaBebida,
        cantidad: Number(row.cantidad ?? 0),
        precioUnitario: Number(row.precio_unitario ?? 0),
        lugarPrecio: (row.lugar_precio ?? '') as string,
        comentarios: (row.comentarios ?? '') as string,
        fechaActualizacion: row.fecha_actualizacion as string,
      }))

      setPresupuestoId(presupuestoRow.id as string)
      setPresupuesto({
        bebidas,
        presupuestoObjetivo: Number(presupuestoRow.presupuesto_objetivo ?? 0),
        moneda: presupuestoRow.moneda === 'USD' ? 'USD' : 'ARS',
        fechaEvento: presupuestoRow.fecha_evento ?? null,
        cantidadInvitados: Number(presupuestoRow.cantidad_invitados ?? 0),
      })
      setIsLoading(false)
    }

    loadPresupuesto()

    return () => {
      isActive = false
    }
  }, [])

  const bebidasFiltradas = useMemo(() => {
    if (filter === 'todas') return presupuesto.bebidas
    return presupuesto.bebidas.filter((bebida) => bebida.categoria === filter)
  }, [filter, presupuesto.bebidas])

  async function handleSubmit(values: BebidaFormValues) {
    if (!presupuestoId) {
      setError('No hay un presupuesto activo para guardar.')
      return
    }

    const now = new Date().toISOString()

    if (editing) {
      const { error: updateError, data } = await supabase
        .from('bebidas')
        .update({
          nombre: values.nombre,
          categoria: values.categoria,
          cantidad: values.cantidad,
          precio_unitario: values.precioUnitario,
          lugar_precio: values.lugarPrecio,
          comentarios: values.comentarios,
        })
        .eq('id', editing.id)
        .select('*')
        .single()

      if (updateError) {
        setError('No se pudo actualizar la bebida.')
        return
      }

      setPresupuesto({
        ...presupuesto,
        bebidas: presupuesto.bebidas.map((bebida) =>
          bebida.id === editing.id
            ? {
                ...editing,
                ...values,
                precioUnitario: values.precioUnitario,
                lugarPrecio: values.lugarPrecio,
                fechaActualizacion: (data?.fecha_actualizacion as string) ?? now,
              }
            : bebida,
        ),
      })
      setEditing(null)
      return
    }

    const { data: insertData, error: insertError } = await supabase
      .from('bebidas')
      .insert({
        presupuesto_id: presupuestoId,
        nombre: values.nombre,
        categoria: values.categoria,
        cantidad: values.cantidad,
        precio_unitario: values.precioUnitario,
        lugar_precio: values.lugarPrecio,
        comentarios: values.comentarios,
      })
      .select('*')
      .single()

    if (insertError || !insertData) {
      setError('No se pudo guardar la bebida.')
      return
    }

    const nuevaBebida: Bebida = {
      id: insertData.id as string,
      nombre: insertData.nombre as string,
      categoria: insertData.categoria as CategoriaBebida,
      cantidad: Number(insertData.cantidad ?? values.cantidad),
      precioUnitario: Number(insertData.precio_unitario ?? values.precioUnitario),
      lugarPrecio: (insertData.lugar_precio ?? values.lugarPrecio) as string,
      comentarios: (insertData.comentarios ?? values.comentarios) as string,
      fechaActualizacion: (insertData.fecha_actualizacion as string) ?? now,
    }

    setPresupuesto({
      ...presupuesto,
      bebidas: [nuevaBebida, ...presupuesto.bebidas],
    })
  }

  async function handleDelete(id: string) {
    const { error: deleteError } = await supabase.from('bebidas').delete().eq('id', id)
    if (deleteError) {
      setError('No se pudo eliminar la bebida.')
      return
    }

    setPresupuesto({
      ...presupuesto,
      bebidas: presupuesto.bebidas.filter((bebida) => bebida.id !== id),
    })
  }

  const totalCantidadValue = totalCantidad(presupuesto.bebidas)
  const totalGastoValue = totalGasto(presupuesto.bebidas)

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10 text-center text-sm text-[color:var(--muted)]">
        Cargando presupuesto desde Supabase...
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:gap-6 sm:px-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}
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
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setPresupuesto({ ...presupuesto, presupuestoObjetivo: value })
                  if (presupuestoId) {
                    supabase
                      .from('presupuestos')
                      .update({ presupuesto_objetivo: value })
                      .eq('id', presupuestoId)
                      .then(({ error: updateError }) => {
                        if (updateError) setError('No se pudo actualizar el presupuesto.')
                      })
                  }
                }}
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
                onChange={(event) => {
                  const value = Number(event.target.value)
                  setPresupuesto({ ...presupuesto, cantidadInvitados: value })
                  if (presupuestoId) {
                    supabase
                      .from('presupuestos')
                      .update({ cantidad_invitados: value })
                      .eq('id', presupuestoId)
                      .then(({ error: updateError }) => {
                        if (updateError) setError('No se pudo actualizar invitados.')
                      })
                  }
                }}
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
