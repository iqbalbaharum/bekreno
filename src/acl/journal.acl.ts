export const JournalAcl = {
  'create-journal': {
    allowedRoles: ['cohort'],
  },
  'update-journal': {
    allowedRoles: ['cohort'],
  },
  'change-status': {
    allowedRoles: ['admin'],
  },
  'add-comment': {
    allowedRoles: ['cohort', 'admin'],
  },
};
