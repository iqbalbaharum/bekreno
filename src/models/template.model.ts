import {Entity, model, property} from '@loopback/repository';
@model()
export class Template extends Entity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    defaultFn: 'uuidv4',
  })
  uuid?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
    default: 'email', // email | message
    required: true
  })
  type: string;

  @property({
    type: 'string',
  })
  sender?: string;

  @property({
    type: 'string',
  })
  from?: string;

  @property({
    type: 'string',
  })
  replyTo?: string;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    mysql: {
      dataType: 'text'
    }
  })
  body?: string;

  @property({
    type: 'string',
    default: 'en-US'
  })
  language?: string;

  constructor(data?: Partial<Template>) {
    super(data);
  }
}

export interface TemplateRelations {
  // describe navigational properties here
}

export type EmailTemplateWithRelations = Template & TemplateRelations;
