import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {SmsTacDataSource} from '../datasources';

export interface SmsTac {
  sendSms(mobile: string, message: string, rid: string): Promise<string>;
}

export class SmsTacProvider implements Provider<SmsTac> {
  constructor(
    // SmsTac must match the name property in the datasource json file
    @inject('datasources.SmsTac')
    protected dataSource: SmsTacDataSource = new SmsTacDataSource(),
  ) {}

  value(): Promise<SmsTac> {
    return getService(this.dataSource);
  }
}
