import { Cron } from '../../cron/entities/cron.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('', {
  orderBy: {
    sentAt: 'DESC',
  },
})
export class Job {
  @PrimaryColumn()
  @ApiProperty({
    type: String,
    description: 'Job id',
  })
  id: string;

  @ManyToOne((type) => Cron, (cron) => cron.jobs)
  @ApiProperty({
    type: Cron,
    description: 'Cron under which this job is executed',
  })
  cron: Cron;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Email id of the sender',
  })
  emailSender: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Email id of the receiver',
  })
  emailReceiver: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({
    type: Date,
    description: 'Timestamp when email was sent',
  })
  sentAt: Date;

  @Column()
  @ApiProperty({
    type: Boolean,
    description: 'Email sent status',
  })
  isEmailSent: Boolean;
}
