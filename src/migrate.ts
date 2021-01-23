import {BalJsApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new BalJsApplication();
  await app.boot();
  await app.migrateSchema({
    existingSchema,
    models: [
      'User',
      'UserNote',
      'Credential',
      'Email',
      'EmailTemplate',
      'Company',
      'Zone',
      'Role',
      'UserRole',
      'Permission',
      'Rolepermission',
      'Module',
      'ModulePermission',
      'Operation',
      'OperationPermission',
      'Session',
      'Project',
      'Journal',
      'DevEnvironment',
      'Profile',
      'Comment',
      'Material',
      'Position',
      'Repository',
      'RepositoryNote',
      'Application',
      'UserApplication',
      'ApplicationProject',
      'Tags',
      'Taging',
      'Note'
    ],
  });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
