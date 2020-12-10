export const ApplicationProjectSchema = {
  type: 'object',
  required: ['projectId'],
  properties: {
    projectId: {
      type: 'string',
    },
  },
};
