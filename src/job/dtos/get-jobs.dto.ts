import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Cron id',
    example: '511fb15e-f60c-4c90-8e20-96ef1dc7d824',
  })
  id: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: 'Page number',
    example: 1,
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: Number,
    description: 'Limit of each page',
    example: 5,
  })
  limit: number;
}
