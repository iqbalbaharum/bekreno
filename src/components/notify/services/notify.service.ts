import {config, extensionPoint, extensions, Getter} from '@loopback/core';
import {Notify, NOTIFY_EXTENSION_POINT_NAME} from '../types/notify.types';

export interface NotifyServiceOption {}

@extensionPoint(NOTIFY_EXTENSION_POINT_NAME)
export class NotifyService {
  constructor(
    @extensions()
    private getNotifies: Getter<Notify[]>,

    @config()
    public readonly options?: NotifyServiceOption
  ){}

  async findNotify(type: string) : Promise<Notify | undefined> {
    const notifies = await this.getNotifies()
    return notifies.find(e => e.type === type)
  }

  async push(type: string, object: Object) {
    const notify = await this.findNotify(type)
    if(notify) {
      console.log(await object)
    }
  }
}
