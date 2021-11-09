export const CalendarStatusSchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'approved', 'rejected']
    },
  },
};
