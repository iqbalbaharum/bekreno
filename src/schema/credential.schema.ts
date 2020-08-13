export const CredentialSchema = {
  type: 'object',
  required: ['mobile', 'password'],
  properties: {
    mobile: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};
