import {Entity, model, property} from '@loopback/repository';

@model()
export class Container extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;


  constructor(data?: Partial<Container>) {
    super(data);
  }
}

export interface ContainerRelations {
  // describe navigational properties here
}

export type ContainerWithRelations = Container & ContainerRelations;
