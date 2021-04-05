import {Binding, Component, createBindingFromClass} from '@loopback/core';
import {NOTIFY_SERVICE} from './keys';
import {NotifyEmail} from './notify/notify-email';
import {NotifyService} from './services/notify.service';

export class NotifyComponent implements Component {
  bindings: Binding[] =[
    createBindingFromClass(NotifyService, {
      key: NOTIFY_SERVICE
    }),

    createBindingFromClass(NotifyEmail)
  ]
}
