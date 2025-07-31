export interface Project {
  descripcion_detalle: null | string
  encargado_detalle: null | string
  id: number
  id_expediente: number
  nombre: string
  tipo: string
  region: string
  tipologia: string
  titular: string
  sub_tipologia: null | string
  inversion: string
  fecha: string
  fecha_termino: Date | null
  estado: string
  dias_evaluacion: number | null
  dias_suspension: number | null
  potencia: number | null
  comuna: null | string
  x: null | string
  y: null | string
  validado: Validado | null
  cant_relacionados: number | null
  fecha_resolucion: null | string
  nro_resolucion: null | string
}

export enum Validado {
  Empty = '',
  Validado = 'Validado',
}
