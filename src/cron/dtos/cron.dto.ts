import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CronDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Cron id',
    example: '511fb15e-f60c-4c90-8e20-96ef1dc7d824',
  })
  id: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: 'Interval b/w two cron jobs',
    example: 30,
  })
  frequency: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Email content',
    example: 'Drink Water!',
  })
  message: string;
}
