export const SignUpSchema = {
  type: 'object',
  required: ['name', 'mobile', 'email', 'password'],
  properties: {
    name: {
      type: 'string',
    },
    mobile: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};
