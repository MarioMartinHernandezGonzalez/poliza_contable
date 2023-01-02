import { Injectable } from '@nestjs/common'
import { CreatePolizaContableDto } from './dto/create-poliza-contable.dto'
import { MambuService } from '../mambu/mambu.service'
import { PolizaContable } from '../mambu/poliza-contable'

@Injectable()
export class PolizaContableService {
  constructor(private readonly mambuService: MambuService) {}

  getBranchs(responseJournal) {
    const branchs = new Set()
    responseJournal.forEach(function (value) {
      branchs.add(value.assignedBranchKey)
    })
    return [...branchs]
  }

  async getCentroBeneficios(branchs) {
    const mapCentroBeneficios = new Map()
    const mapJournal = new Map()
    for (let index = 0; index < branchs.length; index++) {
      const centroBeneficios = await this.mambuService.branch(branchs[index])
      mapCentroBeneficios.set(branchs[index], centroBeneficios)
      mapJournal.set(branchs[index], [])
    }
    return [mapCentroBeneficios, mapJournal]
  }

  getResponse(mapJournal) {
    const response = []
    for (const key of mapJournal.keys()) {
      const registros = mapJournal.get(key)
      // se ordena
      registros.sort(
        (a, b) =>
          a.bookingDate.localeCompare(b.bookingDate) ||
          a.glAccount.glCode.localeCompare(b.glAccount.glCode) ||
          a.type.localeCompare(b.type)
      )

      let debito = 0
      let credito = 0
      let cuenta = ''
      let moneda = ''
      let fechaPoliza = ''
      let centroBeneficios = ''

      let cuentaAux = registros[0].glAccount.glCode
      let fechaAux = registros[0].bookingDate

      for (let i = 0; i < registros.length; i++) {
        if (
          (cuentaAux !== registros[i].glAccount.glCode ||
            fechaAux !== registros[i].bookingDate) &&
          i !== registros.length - 1
        ) {
          // crea registro con reglas de la poliza contable
          const rules = this.getRules(
            fechaPoliza,
            cuenta,
            moneda,
            debito,
            credito,
            centroBeneficios
          )
          response.push(rules)
          // reseteo de valores para crear un registro nuevo
          debito = 0
          credito = 0
          fechaAux = registros[i].bookingDate
          cuentaAux = registros[i].glAccount.glCode
        } else if (i === registros.length - 1) {
          if (
            cuentaAux === registros[i].glAccount.glCode &&
            fechaAux === registros[i].bookingDate
          ) {
            if (registros[i].type === 'CREDIT') {
              credito = credito + registros[i].amount
            } else {
              debito = debito + registros[i].amount
            }
            const rules = this.getRules(
              fechaPoliza,
              cuenta,
              moneda,
              debito,
              credito,
              centroBeneficios
            )
            response.push(rules)
            break
          } else {
            let rules = this.getRules(
              fechaPoliza,
              cuenta,
              moneda,
              debito,
              credito,
              centroBeneficios
            )
            response.push(rules)
            credito = 0
            debito = 0
            if (registros[i].type === 'CREDIT') {
              credito = registros[i].amount
            } else {
              debito = registros[i].amount
            }
            cuenta = registros[i].glAccount.glCode
            moneda = registros[i].glAccount.currency.code
            fechaPoliza = registros[i].bookingDate
            centroBeneficios = registros[i].assignedBranchKey
            rules = this.getRules(
              fechaPoliza,
              cuenta,
              moneda,
              debito,
              credito,
              centroBeneficios
            )
            response.push(rules)

            break
          }
        }
        // logica para contadores
        if (registros[i].type === 'CREDIT') {
          credito = credito + registros[i].amount
        } else {
          debito = debito + registros[i].amount
        }
        //asignacion de valores
        cuenta = registros[i].glAccount.glCode
        moneda = registros[i].glAccount.currency.code
        fechaPoliza = registros[i].bookingDate
        centroBeneficios = registros[i].assignedBranchKey
      }
    }
    return response
  }

  getRules(fechaRegistro, cuenta, moneda, debito, credito, centroBeneficios) {
    let unidadOperativa = ''
    let departamento = ''
    let negocio = ''
    let proyecto = ''
    if (
      cuenta.substring(0, 7) !== '1011007' &&
      cuenta.substring(0, 7) !== '1224001'
    ) {
      unidadOperativa = centroBeneficios.substring(0, 5)
      departamento = '2600'

      if (cuenta.substring(0, 1) === '4') {
        negocio = 'ADMON'
        proyecto = 'OMEGA(CSG)'
      }
    }
    return this.createObjectPoliza([
      fechaRegistro,
      cuenta,
      moneda,
      debito,
      credito,
      unidadOperativa,
      departamento,
      negocio,
      proyecto
    ])
  }

  createObjectPoliza(valores) {
    const poliza = new PolizaContable()
      .fechaRegistro(valores[0])
      .cuenta(valores[1])
      .moneda(valores[2])
      .importe(valores[3] * -1 + valores[4])
      .unidadOperativa(valores[5])
      .departamento(valores[6])
      .negocio(valores[7])
      .proyecto(valores[8])
      .build()
    return poliza
  }

  async create(createPolizaContableDto: CreatePolizaContableDto) {
    // obtenemos asientos diarios
    const responseJournal = await this.mambuService.journalEntries(
      createPolizaContableDto.from,
      createPolizaContableDto.to
    )
    //intereses devengados
    const responseInterestaccrual = await this.mambuService.interestaccrual(
      createPolizaContableDto.from,
      createPolizaContableDto.to
    )
    //parseando a estructra de asientos diarios, ya que esa logica ya se tenia
    responseInterestaccrual.forEach(function (value) {
      const record = {
        creationDate: value.creationDate,
        bookingDate: value.bookingDate,
        amount: value.amount,
        glAccount: {
          glCode: value.accountId,
          currency: {
            code: 'MXN'
          }
        },
        type: value.entryType,
        assignedBranchKey: value.branchKey
      }
      //responseJournal.push(record)
    })

    // obteniendo  todos los centros de beneficios sin repetidos para despues agrupar
    const branchs = this.getBranchs(responseJournal)

    // creando map con los valores del centro de beneficios de financiera
    const centroBeneficios = await this.getCentroBeneficios(branchs)

    const mapCentroBeneficios = centroBeneficios[0]

    const mapJournal = centroBeneficios[1]

    // agrupa por centro de beneficios
    const moment = require('moment')
    responseJournal.forEach(function (value) {
      const branch = value.assignedBranchKey
      const aux = mapJournal.get(branch)
      aux.push({
        creationDate: value.creationDate,
        bookingDate: moment(value.bookingDate).format('DD/MM/YYYY'),
        amount: value.amount,
        glAccount: value.glAccount,
        type: value.type,
        assignedBranchKey: mapCentroBeneficios.get(value.assignedBranchKey)
      })
      mapJournal.set(branch, aux)
    })

    const { parse } = require('json2csv')
    const fields = [
      'unidadNegocio',
      'fechaRegistro',
      'grupoContable',
      'cuenta',
      'moneda',
      'importe',
      'unidadOperativa',
      'departamento',
      'negocio',
      'proyecto'
    ]
    const opt = { fields }
    try {
      const csv = parse(this.getResponse(mapJournal), opt)
      return csv
    } catch (e) {
      console.log(e)
    }
  }
}
