export const ApplicationCloseSchema = {
  type: 'object',
  required: ['applicationId', 'acceptedUserApplicationIds'],
  properties: {
    applicationId: {
      type: 'string',
    },
    acceptedUserApplicationIds: {
      type: 'array',
      items: {
        type: 'string',
      }
    }
  },
};
