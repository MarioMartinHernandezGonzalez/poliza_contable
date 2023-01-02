import { polizaContableInterface } from './interfaces/poliza-contable.interface'

export class PolizaContable {
  private readonly poliza: polizaContableInterface

  constructor() {
    this.poliza = {
      unidadNegocio: 'OMEGA',
      fechaRegistro: '',
      grupoContable: 'REAL',
      cuenta: '',
      moneda: '',
      importe: 0,
      unidadOperativa: '',
      departamento: '',
      negocio: '',
      proyecto: ''
    }
  }

  fechaRegistro(fechaRegistro: string): PolizaContable {
    this.poliza.fechaRegistro = fechaRegistro
    return this
  }

  cuenta(cuenta: string): PolizaContable {
    this.poliza.cuenta = cuenta
    return this
  }

  moneda(moneda: string): PolizaContable {
    this.poliza.moneda = moneda
    return this
  }
  importe(importe: number): PolizaContable {
    this.poliza.importe = importe
    return this
  }

  unidadOperativa(unidadOperativa: string): PolizaContable {
    this.poliza.unidadOperativa = unidadOperativa
    return this
  }
  departamento(departamento: string): PolizaContable {
    this.poliza.departamento = departamento
    return this
  }

  negocio(negocio: string): PolizaContable {
    this.poliza.negocio = negocio
    return this
  }
  proyecto(proyecto: string): PolizaContable {
    this.poliza.proyecto = proyecto
    return this
  }
  build(): polizaContableInterface {
    return this.poliza
  }
}
