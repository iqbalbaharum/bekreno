import {injectable} from '@loopback/context';
import {asNotify, Notify} from '../types/notify.types';

@injectable(asNotify)
export class NotifyEmail implements Notify {

  constructor() {}

  type = 'push-notification'

  push(object: Object, ...args: any[]) {
    return 'Hello'
  }
}
