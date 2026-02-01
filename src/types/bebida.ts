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
  lugarPrecio: string
  comentarios: string
  fechaActualizacion: Date
}

export interface Presupuesto {
  bebidas: Bebida[]
  presupuestoObjetivo: number
  moneda: 'ARS' | 'USD'
  fechaEvento: Date
  cantidadInvitados: number
}
