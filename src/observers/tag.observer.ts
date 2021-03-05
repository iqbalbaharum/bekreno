import {lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Tags} from '../models';
import {TagsRepository} from '../repositories';
import * as tags from '../server/tags.json';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('Seeder')
export class TagObserver implements LifeCycleObserver {
  constructor(
    @repository(TagsRepository)
    protected tagsRepository: TagsRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const count = (await this.tagsRepository.count()).count;
    if (count !== 0) return;

    tags.data.forEach(tag => {
      this.tagsRepository.create(new Tags(tag));
    });
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
