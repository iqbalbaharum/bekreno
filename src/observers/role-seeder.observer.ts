import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';

import {
  repository
} from '@loopback/repository'

import {Role} from './../models';
import {RoleRepository} from '../repositories';
import * as roles from './../server/roles.json'

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('Seeder')
export class RoleSeederObserver implements LifeCycleObserver {

  constructor(
    @repository(RoleRepository) 
    public roleRepository: RoleRepository  
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    const count = (await this.roleRepository.count()).count;
    if(count !== 0) return
    
    roles.data.forEach(role => {
      this.roleRepository.create(new Role(role))
    })
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
