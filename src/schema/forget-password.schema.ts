export const ForgetPasswordSchema = {
  type: 'object',
  required: ['token', 'password'],
  properties: {
    token: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 4,
    },
  },
};
