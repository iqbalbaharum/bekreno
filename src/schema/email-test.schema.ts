export const EmailTestSchema = {
  type: 'object',
  required: ['code', 'to'],
  properties: {
    code: {
      type: 'string',
    },
    to: {
      type: 'string',
    },
    data: {
      type: 'string'
    }
  },
};
