export const OTPCredentialSchema = {
  type: 'object',
  required: ['code'],
  properties: {
    code: {
      type: 'string',
      length: 6,
    },
  },
};
