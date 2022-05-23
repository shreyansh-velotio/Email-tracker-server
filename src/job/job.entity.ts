import { Cron } from '../cron/cron.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('', {
  orderBy: {
    sentAt: 'DESC',
  },
})
export class Job {
  @PrimaryColumn()
  id: string;

  @ManyToOne((type) => Cron, (cron) => cron.jobs)
  cron: Cron;

  @Column()
  emailSender: string;

  @Column()
  emailReceiver: string;

  @Column({ type: 'timestamptz' })
  sentAt: Date;

  @Column()
  isEmailSent: Boolean;
}
