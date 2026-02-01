import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
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
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [isSendingLink, setIsSendingLink] = useState(false)
  const [allowedEmails] = useState(() => {
    const raw = import.meta.env.VITE_ALLOWED_EMAILS ?? ''
    return raw
      .split(',')
      .map((entry: string) => entry.trim().toLowerCase())
      .filter(Boolean)
  })
  const [presupuesto, setPresupuesto] = useState<Presupuesto>(DEFAULT_PRESUPUESTO)
  const [presupuestoId, setPresupuestoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Bebida | null>(null)
  const [filter, setFilter] = useState<'todas' | CategoriaBebida>('todas')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalComentario, setModalComentario] = useState('')

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      if (data.session?.user?.email && allowedEmails.length > 0) {
        const normalized = data.session.user.email.toLowerCase()
        if (!allowedEmails.includes(normalized)) {
          setError('Email no autorizado.')
          supabase.auth.signOut()
          setSession(null)
          setIsLoading(false)
          return
        }
      }
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!isMounted) return
      if (next?.user?.email && allowedEmails.length > 0) {
        const normalized = next.user.email.toLowerCase()
        if (!allowedEmails.includes(normalized)) {
          setError('Email no autorizado.')
          supabase.auth.signOut()
          setSession(null)
          return
        }
      }
      setSession(next)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let isActive = true
    const presupuestoSlug = import.meta.env.VITE_PRESUPUESTO_SLUG ?? 'default'

    async function loadPresupuesto() {
      if (!session?.user) {
        setPresupuesto(DEFAULT_PRESUPUESTO)
        setPresupuestoId(null)
        return
      }

      setIsLoading(true)
      setError(null)

      const { data: presupuestoRow, error: presupuestoError } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('slug', presupuestoSlug)
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (presupuestoError) {
        if (isActive) {
          setError('No se pudo cargar el presupuesto desde Supabase.')
          setIsLoading(false)
        }
        return
      }

      let presupuestoActual = presupuestoRow

      if (!presupuestoActual) {
        const { data: created, error: createError } = await supabase
          .from('presupuestos')
          .insert({
            slug: presupuestoSlug,
            user_id: session.user.id,
            presupuesto_objetivo: 0,
            moneda: 'ARS',
            cantidad_invitados: 0,
          })
          .select('*')
          .single()

        if (createError || !created) {
          setError('No se pudo crear el presupuesto.')
          setIsLoading(false)
          return
        }

        presupuestoActual = created
      }

      const { data: bebidasRows, error: bebidasError } = await supabase
        .from('bebidas')
        .select('*')
        .eq('presupuesto_id', presupuestoActual.id)
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

      setPresupuestoId(presupuestoActual.id as string)
      setPresupuesto({
        bebidas,
        presupuestoObjetivo: Number(presupuestoActual.presupuesto_objetivo ?? 0),
        moneda: presupuestoActual.moneda === 'USD' ? 'USD' : 'ARS',
        fechaEvento: presupuestoActual.fecha_evento ?? null,
        cantidadInvitados: Number(presupuestoActual.cantidad_invitados ?? 0),
      })
      setIsLoading(false)
    }

    loadPresupuesto()

    return () => {
      isActive = false
    }
  }, [session])

  const bebidasFiltradas = useMemo(() => {
    if (filter === 'todas') return presupuesto.bebidas
    return presupuesto.bebidas.filter((bebida) => bebida.categoria === filter)
  }, [filter, presupuesto.bebidas])

  async function handleSubmit(values: BebidaFormValues) {
    if (!presupuestoId || !session?.user) {
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
        user_id: session.user.id,
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10 text-center text-sm text-[hsl(var(--text-muted))]">
        Cargando presupuesto desde Supabase...
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-12 text-center">
        <div className="rounded-[var(--r-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 shadow-[0_14px_32px_-26px_rgba(15,23,42,0.4)] sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--text-muted))] sm:text-xs">
            Acceso privado
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-[hsl(var(--text))] sm:text-3xl">
            Entrá con tu email
          </h1>
          <p className="mt-2 text-xs text-[hsl(var(--text-muted))] sm:text-sm">
            Te enviamos un link mágico para entrar sin contraseña.
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:mt-6"
            onSubmit={async (event) => {
              event.preventDefault()
              setError(null)
              if (allowedEmails.length > 0 && !allowedEmails.includes(email.trim().toLowerCase())) {
                setError('Email no autorizado.')
                return
              }
              setIsSendingLink(true)
              const rawSiteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
              const siteUrl = rawSiteUrl.trim().replace(/\/+$/, '')
              const { error: signInError } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: siteUrl },
              })
              setIsSendingLink(false)
              if (signInError) {
                setError('No se pudo enviar el correo. Reintentá en unos segundos.')
              }
            }}
          >
            <input
              className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button
              className="rounded-full bg-[hsl(var(--success))] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
              type="submit"
              disabled={!email || isSendingLink}
            >
              {isSendingLink ? 'Enviando link...' : 'Enviar link mágico'}
            </button>
          </form>
          {error ? (
            <p className="mt-3 text-xs text-red-600">{error}</p>
          ) : null}
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:gap-6 sm:px-6">
      {error ? (
        <div className="rounded-[var(--r-md)] border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}
      <header className="rounded-[var(--r-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-[0_2px_8px_-6px_rgba(15,23,42,0.12)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[hsl(var(--text-muted))] sm:text-xs">
              Presupuesto de bebidas
            </p>
            <h1 className="font-display text-2xl font-semibold text-[hsl(var(--text))] sm:text-3xl">
              Presupuesto Casamiento
            </h1>
            <p className="max-w-xl text-xs text-[hsl(var(--text-muted))] sm:text-sm">
              Controla cantidades, precios y notas con un tablero claro y minimalista.
            </p>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-2 lg:max-w-md">
            <label className="flex flex-col gap-1 rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white px-3 py-2 shadow-[0_4px_12px_-10px_rgba(15,23,42,0.2)]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">
                Presupuesto
              </span>
              <input
                className="w-full bg-transparent text-sm font-semibold text-[hsl(var(--text))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
            <label className="flex flex-col gap-1 rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white px-3 py-2 shadow-[0_4px_12px_-10px_rgba(15,23,42,0.2)]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))]">
                Invitados
              </span>
              <input
                className="w-full bg-transparent text-sm font-semibold text-[hsl(var(--text))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
        <div className="mt-3 flex justify-end">
          <button
            className="rounded-[var(--r-md)] border border-[hsl(var(--border))] bg-white px-3 py-1.5 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] sm:text-xs"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Cerrar sesión
          </button></div>
      </header>

      <ResumenTotal
        totalCantidad={totalCantidadValue}
        totalGasto={totalGastoValue}
        presupuestoObjetivo={presupuesto.presupuestoObjetivo}
        cantidadInvitados={presupuesto.cantidadInvitados}
      />

      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-4">
          <BebidaForm
            key={editing?.id ?? 'nuevo'}
            initialValue={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
          <div className="rounded-[var(--r-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3 shadow-[0_2px_8px_-6px_rgba(15,23,42,0.12)] sm:p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] sm:text-xs">
              Filtros
            </p>
            <div className="mt-2 flex flex-wrap gap-2 sm:mt-3 sm:gap-2">
              {FILTROS.map((categoria) => (
                <button
                  key={categoria}
                  className={`press rounded-[var(--r-md)] border px-3 py-1 text-[10px] font-semibold transition duration-150 ease-[cubic-bezier(.2,.8,.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-3 sm:py-1 sm:text-xs ${
                    filter === categoria
                      ? 'border-[hsl(var(--text))] bg-[hsl(var(--text))] text-white shadow-sm'
                      : 'border-[hsl(var(--border))] text-[hsl(var(--text-muted))] hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))]'
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

        <div className="grid max-w-[760px] gap-3 sm:gap-4">
          {bebidasFiltradas.length === 0 ? (
            <div className="rounded-[var(--r-lg)] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 text-center shadow-[0_2px_8px_-6px_rgba(15,23,42,0.12)] sm:p-8">
              <p className="font-display text-xl font-semibold text-[hsl(var(--text))] sm:text-2xl">
                Empieza tu lista
              </p>
              <p className="mt-1.5 text-xs text-[hsl(var(--text-muted))] sm:mt-2 sm:text-sm">
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

