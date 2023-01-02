import { IsString, MinLength } from 'class-validator'

export class CreatePolizaContableDto {
  @IsString()
  @MinLength(1)
  from: string

  @IsString()
  @MinLength(1)
  to: string
}
