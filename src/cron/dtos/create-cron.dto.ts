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
  })
  frequency: number;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Email content',
  })
  message: string;
}
