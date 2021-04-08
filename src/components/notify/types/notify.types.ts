

export const NOTIFY_EXTENSION_POINT_NAME = 'notify'
export interface Notify {
  type: MessageType,
  push(message: Message): void
}

export interface INotify {
  push(message: Message): Promise<void>
}

export interface Message {
  subject?: string
  content: string
  receiver: string
  type: MessageType
  options?: MessageOptions
}

export interface Config {
  receiver: string;
  type: MessageType;
  options?: MessageOptions
}

export interface Subscriber {
  address: string,
  name?: string,
  [key: string]: any
}
export interface MessageOptions {
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  // sonarignore:end
}

export const enum MessageType {
  NONE = 0,
  EMAIL = 1 << 0,
  ALL = ~(~0 << 1)
}

