import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from './cron.entity';
import { Repository } from 'typeorm';
import { CronDto, UpdateCronDto } from './cron.dto';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Cron) private cronsRepository: Repository<Cron>,
  ) {}

  // return all the crons info with the most recent job details
  getAll(): Promise<Cron[]> {
    return this.cronsRepository
      .createQueryBuilder('cron')
      .leftJoinAndSelect('cron.jobs', 'job')
      .orderBy('job.sentAt', 'DESC')
      .limit(1)
      .getMany();
  }

  getById(id: string): Promise<Cron> {
    return this.cronsRepository.findOneOrFail(id);
  }

  create(dto: CronDto): Promise<Cron> {
    const { id, frequency, message } = dto;
    const cron = this.cronsRepository.create({
      id,
      frequency,
      message,
    });

    return this.cronsRepository.save(cron);
  }

  async update(dto: UpdateCronDto): Promise<Cron> {
    const cron = await this.getById(dto.id);

    cron.frequency = dto.frequency;

    return this.cronsRepository.save(cron);
  }

  async delete(id: string): Promise<Cron> {
    const cron = await this.getById(id);

    return this.cronsRepository.remove(cron);
  }
}
