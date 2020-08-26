export const ModulePermissionSchema = {
  type: 'object',
  required: ['moduleId'],
  properties: {
    moduleId: {
      type: 'string',
    },
  },
};
