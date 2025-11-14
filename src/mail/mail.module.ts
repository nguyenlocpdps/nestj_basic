import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsModule } from 'src/jobs/jobs.module';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { Job, JobSchema } from 'src/jobs/schemas/job.schemas';
import { Subscriber, SubscriberSchema } from 'src/subscribers/schemas/subscriber.schemas';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        preview:
          configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false,
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [
        {name: Job.name, schema: JobSchema},
        {name: Subscriber.name, schema: SubscriberSchema}
      ]
    ),
    SubscribersModule
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
