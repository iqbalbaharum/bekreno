import {DefaultCrudRepository} from '@loopback/repository';
import {Zone, ZoneRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ZoneRepository extends DefaultCrudRepository<
  Zone,
  typeof Zone.prototype.uuid,
  ZoneRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Zone, dataSource);
  }
}
