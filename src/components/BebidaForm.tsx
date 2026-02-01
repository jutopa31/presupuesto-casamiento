import { useState } from 'react'
import type { Bebida, CategoriaBebida } from '../types/bebida'

export interface BebidaFormValues {
  nombre: string
  categoria: CategoriaBebida
  cantidad: number
  precioUnitario: number
  lugarPrecio: string
  comentarios: string
}

interface BebidaFormProps {
  initialValue?: Bebida
  onSubmit: (values: BebidaFormValues) => void
  onCancel?: () => void
}

const CATEGORIAS: CategoriaBebida[] = [
  'destilado',
  'vino',
  'cerveza',
  'sin-alcohol',
  'otro',
]

const DEFAULT_VALUES: BebidaFormValues = {
  nombre: '',
  categoria: 'destilado',
  cantidad: 1,
  precioUnitario: 0,
  lugarPrecio: '',
  comentarios: '',
}

export default function BebidaForm({ initialValue, onSubmit, onCancel }: BebidaFormProps) {
  const [form, setForm] = useState<BebidaFormValues>(() =>
    initialValue
      ? {
          nombre: initialValue.nombre,
          categoria: initialValue.categoria,
          cantidad: initialValue.cantidad,
          precioUnitario: initialValue.precioUnitario,
          lugarPrecio: initialValue.lugarPrecio,
          comentarios: initialValue.comentarios,
        }
      : DEFAULT_VALUES,
  )

  function updateField<T extends keyof BebidaFormValues>(key: T, value: BebidaFormValues[T]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Formulario
          </p>
          <h3 className="font-display text-2xl font-semibold text-slate-900">
            {initialValue ? 'Editar bebida' : 'Nueva bebida'}
          </h3>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Bebida
          <input
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Fernet, Vino Tinto..."
            value={form.nombre}
            onChange={(event) => updateField('nombre', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Categoria
          <select
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            value={form.categoria}
            onChange={(event) => updateField('categoria', event.target.value as CategoriaBebida)}
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Cantidad
          <input
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            type="number"
            min={1}
            value={form.cantidad}
            onChange={(event) => updateField('cantidad', Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Precio unitario
          <input
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            type="number"
            min={0}
            step="0.01"
            value={form.precioUnitario}
            onChange={(event) => updateField('precioUnitario', Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          Lugar del precio
          <input
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Carrefour, mayorista..."
            value={form.lugarPrecio}
            onChange={(event) => updateField('lugarPrecio', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 md:col-span-2">
          Comentarios
          <textarea
            className="min-h-[90px] rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-normal text-slate-900 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Notas adicionales"
            value={form.comentarios}
            onChange={(event) => updateField('comentarios', event.target.value)}
          />
        </label>
      </div>
      <div className="mt-5 flex items-center justify-end gap-2">
        {onCancel ? (
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : null}
        <button
          className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-400"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </form>
  )
}
