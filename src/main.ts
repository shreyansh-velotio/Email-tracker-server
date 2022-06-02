import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Email Tracker API')
    .setDescription('apis to create and update email sending cron jobs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
  });
}
bootstrap();

/**
 * LOGIC
 *
 * 1. creating a new cron job (producing)
 *    i. create the cron job
 *    ii. fill the cron table (cronId, every, message)
 * 2. consuming the cron job
 *    i. Send email
 *    ii. create a job entry in job table (jobId, cronId, senderEmail, receiverEmail, emailSentStatus)
 * 3. update a cron job
 *    i. get the cronId from the user
 *    ii. look up the frequency of the cron in the db
 *    iii. combine the above two and make the actual cronId used in the redis
 *    iv. delete the cron in the redis using removeRepetableJobByKey
 *    v. create a new cron in redis with the same id but different frequency
 *    vi. update the 'frequency' column in cron table
 */
