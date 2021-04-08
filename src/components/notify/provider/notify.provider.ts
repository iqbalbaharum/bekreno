import {Getter, Provider} from '@loopback/context';
import {extensionPoint, extensions} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {INotify, Message, Notify, NOTIFY_EXTENSION_POINT_NAME} from '../types';

@extensionPoint(NOTIFY_EXTENSION_POINT_NAME)
export class NotifyProvider implements Provider<INotify> {
  constructor(
    @extensions()
    private getNotifies: Getter<Notify[]>,
  ) {}

  async push(data: Message) {

    const notifies = await this.getNotifies()
    let notify = notifies.find(e => e.type === data.type)

    if(!notify) {
      throw new HttpErrors.UnprocessableEntity(
        'ProviderNotFound'
      )
    }

    notify.push(data)
  }

  value() {
    return {
      push: async (message: Message) => this.push(message)
    }
  }



}
