import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  vatRate?: number;
}
