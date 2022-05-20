import { Cron } from 'src/cron/cron.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('', {
  orderBy: {
    sentAt: 'DESC',
  },
})
export class Job {
  @PrimaryColumn()
  id: string;

  @ManyToOne((type) => Cron, (cron) => cron.id)
  cron: string;

  @Column()
  emailSender: string;

  @Column()
  emailReceiver: string;

  @Column({ type: 'timestamptz' })
  sentAt: Date;

  @Column()
  isEmailSent: Boolean;
}
