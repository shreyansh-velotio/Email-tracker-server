import { Job } from '../../job/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cron {
  @PrimaryColumn()
  @ApiProperty({
    type: String,
    description: 'Cron id',
    example: '511fb15e-f60c-4c90-8e20-96ef1dc7d824',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: Number,
    description: 'Interval b/w two cron jobs',
    example: 30,
  })
  frequency: number;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Email content',
    example: 'Drink Water!',
  })
  message: string;

  @OneToMany((type) => Job, (job) => job.cron)
  @ApiProperty({
    type: Array(Job),
    description: 'List of jobs performed by the cron',
  })
  jobs: Job[];
}
