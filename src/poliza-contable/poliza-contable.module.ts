import { Module } from '@nestjs/common'
import { PolizaContableService } from './poliza-contable.service'
import { PolizaContableController } from './poliza-contable.controller'
import { MambuModule } from '../mambu/mambu.module'

@Module({
  controllers: [PolizaContableController],
  providers: [PolizaContableService],
  imports: [MambuModule]
})
export class PolizaContableModule {}
