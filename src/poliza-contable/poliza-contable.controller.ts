import { Controller, Post, Body, Res } from '@nestjs/common'
import { PolizaContableService } from './poliza-contable.service'
import { CreatePolizaContableDto } from './dto/create-poliza-contable.dto'
import { Response } from 'express'

@Controller('poliza-contable/v1')
export class PolizaContableController {
  constructor(private readonly polizaContableService: PolizaContableService) {}

  @Post('create')
  async create(
    @Body() createPolizaContableDto: CreatePolizaContableDto) {
    return  await this.polizaContableService.create(createPolizaContableDto)
    
    
  }  
}