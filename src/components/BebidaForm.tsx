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
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-[0_12px_30px_-24px_rgba(26,26,26,0.45)] sm:rounded-3xl sm:p-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--text-muted))] sm:text-xs">
            Formulario
          </p>
          <h3 className="font-display text-xl font-semibold text-[hsl(var(--text))] sm:text-2xl">
            {initialValue ? 'Editar bebida' : 'Nueva bebida'}
          </h3>
        </div>
      </div>
      <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))]">
          Bebida
          <input
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
            placeholder="Fernet, Vino Tinto..."
            value={form.nombre}
            onChange={(event) => updateField('nombre', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))]">
          Categoria
          <select
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
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
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))]">
          Cantidad
          <input
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
            type="number"
            min={1}
            value={form.cantidad}
            onChange={(event) => updateField('cantidad', Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))]">
          Precio unitario
          <input
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
            type="number"
            min={0}
            step="0.01"
            value={form.precioUnitario}
            onChange={(event) => updateField('precioUnitario', Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))]">
          Lugar del precio
          <input
            className="rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
            placeholder="Carrefour, mayorista..."
            value={form.lugarPrecio}
            onChange={(event) => updateField('lugarPrecio', event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[hsl(var(--text))] md:col-span-2">
          Comentarios
          <textarea
            className="min-h-[90px] rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm font-normal text-[hsl(var(--text))] shadow-inner focus:border-[hsl(var(--success))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--success))] focus:ring-opacity-30"
            placeholder="Notas adicionales"
            value={form.comentarios}
            onChange={(event) => updateField('comentarios', event.target.value)}
          />
        </label>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 sm:mt-5">
        {onCancel ? (
          <button
            className="rounded-full border border-[hsl(var(--border))] bg-white px-3 py-1.5 text-[10px] font-semibold text-[hsl(var(--text-muted))] transition hover:border-[hsl(var(--text))] hover:text-[hsl(var(--text))] sm:px-4 sm:py-2 sm:text-xs"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        ) : null}
        <button
          className="rounded-full bg-[hsl(var(--success))] px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm transition hover:opacity-90 sm:px-4 sm:py-2 sm:text-xs"
          type="submit"
        >
          Guardar
        </button>
      </div>
    </form>
  )
}


