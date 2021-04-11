import {Entity, model, property} from '@loopback/repository';

@model()
export class Email extends Entity {
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
  to: string;

  @property({
    type: 'string'
  })
  from: string;

  @property({
    type: 'string'
  })
  replyTo: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'string',
    required: true,
  })
  receiver: string;

  constructor(data?: Partial<Email>) {
    super(data);
  }
}

export interface EmailRelations {
  // describe navigational properties here
}

export type EmailWithRelations = Email & EmailRelations;
