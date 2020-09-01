export const UserRoleSchema = {
  type: 'object',
  required: ['roleId'],
  properties: {
    roleId: {
      type: 'string',
    },
  },
};
