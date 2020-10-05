export const UserTrackSchema = {
  type: 'object',
  required: ['trackId'],
  properties: {
    trackId: {
      type: 'string',
    },
  },
};
