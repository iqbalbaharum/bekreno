export const UserApplicationSchema = {
  type: 'object',
  required: ['applicationId'],
  properties: {
    applicationId: {
      type: 'string',
    },
  },
};
