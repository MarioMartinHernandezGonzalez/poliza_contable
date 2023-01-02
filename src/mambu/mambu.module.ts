import { Module } from '@nestjs/common'
import { MambuService } from './mambu.service'

@Module({
  controllers: [],
  providers: [MambuService],
  exports: [MambuService]
})
export class MambuModule {}
