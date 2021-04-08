import {BindingKey, BindingTemplate} from '@loopback/context';
import {extensionFor} from '@loopback/core';
import {INotify, NOTIFY_EXTENSION_POINT_NAME} from './types';

export namespace NotifyBindings {
  export const NotificationProvider = BindingKey.create<INotify>(
    'sf.notify',
  );

  export const EmailProvider = BindingKey.create<INotify>(
    'sf.notify.email',
  );
}

export const asNotify: BindingTemplate = binding => {
  extensionFor(NOTIFY_EXTENSION_POINT_NAME) (binding)
  binding.tag({ namespace: 'notify' })
}
