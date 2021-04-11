import {
  lifeCycleObserver,
  LifeCycleObserver
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Template} from '../models';
import {TemplateRepository} from '../repositories';
import * as templates from '../server/templates.json';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('Seeder')
export class TemplateSeederObserver implements LifeCycleObserver {

  constructor(
    @repository(TemplateRepository)
    public templateRepository: TemplateRepository
  ) {}


  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const count = (await this.templateRepository.count()).count;
    if(count !== 0) return

    templates.data.forEach(template => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.templateRepository.create(new Template(template))
    })
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
