export const UserChannelSchema = {
  type: 'object',
  required: ['channels'],
  properties: {
    channels: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
