import {
  inject, lifeCycleObserver,
  LifeCycleObserver
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserChannelRepository, UserRepository} from '../repositories';
import {UserChannelService} from '../services';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('Seeder')
export class UserChannelObserver implements LifeCycleObserver {

  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserChannelRepository) protected userChannelRepository: UserChannelRepository,
    @inject('services.UserChannelService') public userChannelService: UserChannelService
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    let userChannelCount = await this.userChannelRepository.count()
    if(userChannelCount.count !== 0) return

    const users = await this.userRepository.find({ include: [
      {relation: 'roles' },
      {relation: 'journals' },
      {relation: 'profile' },
      {relation: 'applications' },
      {relation: 'repositories' },
      {relation: 'topics' },
      {relation: 'projects' }
    ]})

    for(const user of users) {
      const tags = []

      if(user.profile && user.profile.completed) {
        tags.push(`profile.completed`)
      }

      tags.push(...user.roles.map(e => `role.${e.name}`))

      if(user.journals) {
        tags.push(...user.journals.map(e => `journal.${e.id}`))
      }

      if(user.applications) {
        tags.push(...user.applications.map(e => `application.${e.id}`))
      }

      if(user.repositories) {
        tags.push(...user.repositories.map(e => `repository.${e.id}`))
        tags.push(...user.repositories.map(e => `project.${e.projectId}`))
      }

      if(user.projects) {
        tags.push(...user.repositories.map(e => `project.${e.projectId}`))
      }

      if(user.topics) {
        tags.push(...user.topics.map(e => `repository.${e.id}`))
      }

      this.userChannelService.tagged(user.uuid!, tags)
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
