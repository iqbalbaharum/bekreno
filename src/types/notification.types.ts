export type Notification = {
  playerIds: [string];
  externalUserIds: [string];
  segments: [string];
  title: string;
  message: string;
};

export enum NotificationType {
  NONE = 'NONE',
  TOPIC = 'TOPIC',
  JOURNAL = 'JOURNAL',
  AUTH = 'AUTH'
}
