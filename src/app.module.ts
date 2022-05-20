import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import config from 'ormconfig';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(config), CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
