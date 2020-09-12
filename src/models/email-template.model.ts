import {Entity, model, property} from '@loopback/repository';

@model()
export class EmailTemplate extends Entity {
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
  })
  body?: string;

  @property({
    type: 'string',
  })
  language?: string;

  constructor(data?: Partial<EmailTemplate>) {
    super(data);
  }
}

export interface EmailTemplateRelations {
  // describe navigational properties here
}

export type EmailTemplateWithRelations = EmailTemplate & EmailTemplateRelations;
