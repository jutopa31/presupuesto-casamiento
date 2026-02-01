import type { Bebida } from '../types/bebida'

export function totalCantidad(bebidas: Bebida[]) {
  return bebidas.reduce((acc, bebida) => acc + bebida.cantidad, 0)
}

export function totalGasto(bebidas: Bebida[]) {
  return bebidas.reduce((acc, bebida) => acc + bebida.cantidad * bebida.precioUnitario, 0)
}

export function ahorroVsPresupuesto(total: number, presupuestoObjetivo: number) {
  return presupuestoObjetivo - total
}
