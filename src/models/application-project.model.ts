import {model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';

@model()
export class ApplicationProject extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  applicationId: string;

  @property({
    type: 'string',
  })
  projectId: string;


  constructor(data?: Partial<ApplicationProject>) {
    super(data);
  }
}

export interface ApplicationProjectRelations {
  // describe navigational properties here
}

export type ApplicationProjectWithRelations = ApplicationProject & ApplicationProjectRelations;
