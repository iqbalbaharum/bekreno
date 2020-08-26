export const OperationPermissionSchema = {
  type: 'object',
  required: ['operationId'],
  properties: {
    operationId: {
      type: 'string',
    },
  },
};
