import {
  lifeCycleObserver,
  LifeCycleObserver
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EmailTemplate} from './../models';
import {EmailTemplateRepository} from './../repositories';
import * as templates from './../server/email-templates.json';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('Seeder')
export class EmailTemplateSeederObserver implements LifeCycleObserver {

  constructor(
    @repository(EmailTemplateRepository)
    public emailTemplateRepository: EmailTemplateRepository
  ) {}


  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const count = (await this.emailTemplateRepository.count()).count;
    if(count !== 0) return

    templates.data.forEach(template => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.emailTemplateRepository.create(new EmailTemplate(template))
    })
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
