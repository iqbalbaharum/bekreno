export const RolePermissionSchema = {
  type: 'object',
  required: ['role'],
  properties: {
    role: {
      type: 'string',
    }
  },
};
