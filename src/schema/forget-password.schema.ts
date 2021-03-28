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

export const EmailPasswordSchema = {
  type: 'object',
  properties: {
      email: {
          type: 'string'
      }
  }
} 