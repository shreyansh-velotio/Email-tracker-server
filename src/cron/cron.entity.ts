import { Job } from 'src/job/job.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Cron {
  @PrimaryColumn()
  id: string;

  @Column()
  frequency: number;

  @Column()
  message: string;

  @OneToMany((type) => Job, (job) => job.id)
  projects: Job[];
}
