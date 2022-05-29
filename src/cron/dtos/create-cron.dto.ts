import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCronDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: 'Interval b/w two cron jobs',
    example: 30,
  })
  frequency: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Email content',
    example: 'Drink Water!',
  })
  message: string;
}
