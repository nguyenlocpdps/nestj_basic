import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/subscriber.schemas';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,

    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,

    @InjectModel(Subscriber.name)
    private subScriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}


  @Get()
  @Public()
  @Cron("0 10 0 * * 0") //0h10 every sun day
  @ResponseMessage('Send email to Subcriber')
  async handleTestEmail() {
    const subscribers = await this.subScriberModel.find({});
    subscribers.forEach(async (sub) => {
      const subSkill = sub.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subSkill },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company,
            skills: item.skills,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
          };
        });

        await this.mailerService.sendMail({
          to: sub.email,
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job', // HTML body content
          context: {
            receiver: sub.name,
            jobs: jobs,
          },
        });
      }
    });
  }
}
