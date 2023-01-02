import { PartialType } from '@nestjs/mapped-types'
import { CreatePolizaContableDto } from './create-poliza-contable.dto'

export class UpdatePolizaContableDto extends PartialType(
  CreatePolizaContableDto
) {}
