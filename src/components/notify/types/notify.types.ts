import {BindingTemplate} from '@loopback/context'
import {extensionFor} from '@loopback/core'

export interface Notify {
  type: string,
  push(object: Object, ...args: any[] ): any
}

export const NOTIFY_EXTENSION_POINT_NAME = 'notify'

export const asNotify: BindingTemplate = binding => {
  extensionFor(NOTIFY_EXTENSION_POINT_NAME) (binding)
  binding.tag({ namespace: 'notify' })
}

