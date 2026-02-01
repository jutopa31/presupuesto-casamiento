export type CategoriaBebida =
  | 'destilado'
  | 'vino'
  | 'cerveza'
  | 'sin-alcohol'
  | 'otro'

export interface Bebida {
  id: string
  nombre: string
  categoria: CategoriaBebida
  cantidad: number
  precioUnitario: number
  comprada: boolean
  lugarPrecio: string
  comentarios: string
  fechaActualizacion: string
}

export interface Presupuesto {
  bebidas: Bebida[]
  presupuestoObjetivo: number | ''
  moneda: 'ARS' | 'USD'
  fechaEvento: string | null
  cantidadInvitados: number | ''
}
