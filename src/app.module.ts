import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MambuService } from './mambu/mambu.service'
import { PolizaContableModule } from './poliza-contable/poliza-contable.module'
import { MambuModule } from './mambu/mambu.module'

@Module({
  imports: [ConfigModule.forRoot(), PolizaContableModule, MambuModule],
  controllers: [AppController],
  providers: [AppService, MambuService]
})
export class AppModule {}
