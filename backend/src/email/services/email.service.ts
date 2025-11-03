import type { ConfigType } from '@nestjs/config';
import emailConfig from '../config/email.config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TemplatesService } from '@/templates/templates.service';

@Injectable()
export default class EmailService {
  protected readonly logger = new Logger(EmailService.name);
  private isInitialized = false;
  private apiKey: string | undefined;
  private apiSender: string | undefined;
  private apiUrl = 'https://api.brevo.com/v3/smtp/email';

  constructor(
    @Inject(emailConfig.KEY)
    protected readonly emailConfiguration: ConfigType<typeof emailConfig>,
    private readonly templatesService: TemplatesService,
  ) {
    // Initialize transporter without blocking startup
    this.initialize().catch((error) => {
      this.logger.error('Failed to initialize email service:', error.message);
    });
  }

  private async initialize() {
    this.apiKey = this.emailConfiguration.apiKey;
    this.apiSender = this.emailConfiguration.sender;
    // Check if email configuration is available
    if (!this.apiKey || !this.apiSender) {
      this.logger.warn('Chave de API de email ou remetente não configurados.');
      this.logger.warn(
        'Por favor, defina EMAIL_API_KEY e EMAIL_SENDER no arquivo .env para habilitar o envio de emails.',
      );
      this.isInitialized = false;
      return;
    } else {
      this.logger.log('Configuração de email via API carregada com sucesso.');
      this.isInitialized = true;
    }

    this.logger.log('Serviço de email inicializado com sucesso.');
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    template?: string;
    html?: string;
    context?: Record<string, any>;
    from?: string;
    text?: string;
  }) {
    if (!this.isInitialized) {
      throw new Error(
        'Serviço de email não está inicializado corretamente. Verifique as configurações de email.',
      );
    }

    const from = options.from || this.emailConfiguration.user;

    let html = options.html;

    if (options.template) {
      html = await this.templatesService.renderTemplate(
        options.template,
        options.context || {},
        {
          service: 'email',
        },
      );
    }

    this.logger.debug(
      `Enviando email para: ${options.to} com assunto: ${options.subject}`,
    );

    const payload: any = {
      sender: { email: this.apiSender, name: 'MindTrack' },
      to: [{ email: options.to }],
      subject: options.subject,
    };

    if (html) {
      payload.htmlContent = html;
    }

    if (options.text) {
      payload.textContent = options.text;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey!,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        this.logger.debug(`Email enviado com sucesso para: ${options.to}`);
        return data;
      } else {
        const errorbody = await response.text();
        this.logger.error(
          `Falha ao enviar email para: ${options.to}. Status: ${response.status}, Resposta: ${JSON.stringify(errorbody)}`,
        );
        throw new Error(
          `Falha ao enviar email. Status: ${response.status}, Resposta: ${errorbody}`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Falha ao enviar email para: ${options.to}. Status: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }

    this.logger.log(`Email enviado com sucesso para: ${options.to}`);
  }
}
