import { Controller, Post, Body, Res } from '@nestjs/common'
import { PolizaContableService } from './poliza-contable.service'
import { CreatePolizaContableDto } from './dto/create-poliza-contable.dto'
import { Response } from 'express'

@Controller('poliza-contable/v1')
export class PolizaContableController {
  constructor(private readonly polizaContableService: PolizaContableService) {}

  @Post('create')
  async create(
    @Res() res: Response,
    @Body() createPolizaContableDto: CreatePolizaContableDto) {
    let data = {}
    data = await this.polizaContableService.create(createPolizaContableDto)
    res.header('Content-Type', 'text/csv')
    res.attachment('polizacontable.csv')
    return res.send(data)
  }  
}