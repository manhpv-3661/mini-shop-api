import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SentMessageInfo, Transporter } from 'nodemailer';
import { MAIL_TRANSPORTER_PROVIDER } from '../constants/notifications.constants';
import { MailContent } from '../interfaces/mail-content.interface';

@Injectable()
export class MailerService implements OnModuleDestroy {
  constructor(
    @Inject(MAIL_TRANSPORTER_PROVIDER)
    private readonly transporter: Transporter<SentMessageInfo>,
    private readonly config: ConfigService,
  ) {}

  async sendMail(to: string, content: MailContent): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.getOrThrow<string>('MAIL_FROM'),
      to,
      subject: content.subject,
      html: content.html,
    });
  }

  onModuleDestroy(): void {
    this.transporter.close();
  }
}
