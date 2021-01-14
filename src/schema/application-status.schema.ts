export const ApplicationStatusSchema = {
  type: 'object',
  required: ['applicationId', 'status'],
  properties: {
    applicationId: {
      type: 'string',
    },
    status: {
      type: 'string'
    }
  },
};
