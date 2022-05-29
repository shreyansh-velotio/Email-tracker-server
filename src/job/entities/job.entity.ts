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
    example: 'repeat:3d3d35f16a53906c841e09da946fa35b:1653071610000',
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
    example: 'mailgun@sandboxe9453fed1fd14b5d97fbf12c3fe1218e.mailgun.org',
  })
  emailSender: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Email id of the receiver',
    example: 'shreyansh.shrey@velotio.com',
  })
  emailReceiver: string;

  @Column({ type: 'timestamptz' })
  @ApiProperty({
    type: Date,
    description: 'Timestamp when email was sent',
    example: new Date(),
  })
  sentAt: Date;

  @Column()
  @ApiProperty({
    type: Boolean,
    description: 'Email sent status',
    example: true,
  })
  isEmailSent: Boolean;
}
