import { Job } from '../job/job.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cron {
  @PrimaryColumn()
  @ApiProperty({
    type: String,
    description: 'Cron id',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: Number,
    description: 'Interval b/w two cron jobs',
  })
  frequency: number;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Email content',
  })
  message: string;

  @OneToMany((type) => Job, (job) => job.cron)
  @ApiProperty({
    type: Array(Job),
    description: 'List of jobs performed by the cron',
  })
  jobs: Job[];
}
