import {BindingKey} from '@loopback/context';
import {NotifyService} from './services/notify.service';

export const NOTIFY_SERVICE = BindingKey.create<NotifyService> (
  'services.NotifyService'
)
