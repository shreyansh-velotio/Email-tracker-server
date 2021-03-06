import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from './entities/cron.entity';
import { Repository } from 'typeorm';
import { CronDto } from './dtos/cron.dto';
import { UpdateCronDto } from './dtos/update-cron.dto';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Cron) private cronsRepository: Repository<Cron>,
  ) {}

  // return all the crons info with the most recent job details
  getAll(): Promise<Cron[]> {
    return this.cronsRepository.find();
    /**
     * @note
     * Left join in typeorm
     * 
     * return this.cronsRepository.
      .createQueryBuilder('cron')
      .leftJoinAndSelect('cron.jobs', 'job')
      .orderBy('job.sentAt', 'DESC')
      .getMany();
     */
  }

  getById(id: string): Promise<Cron> {
    return this.cronsRepository.findOne(id);
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
