export const NotificationSchema = {
  type: 'object',
  required: ['title', 'string'],
  properties: {
    playerIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    externalUserIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    segments: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    title: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
  },
};
