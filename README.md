# Krenovator LMS System (Open Source)

### Introduction

Krenovator LMS (backend) is a collaborative learning platform.

## Documentation

- [System requirements](#system-requirements)
- [Setup Steps](#Setup-Steps)
- [Database](#database)
- [Storage](#file-storage)
- [SMTP - Simple Mail Transfer Protocol](#smtp)
- [Database Migration](#database-migration)
- [System Architecture]()
- [Troubleshooting](#)

## System Requirements

Required to be installed:

- [NodeJS v12 or higher](https://nodejs.org/en/)
- [MySQL](https://dev.mysql.com/downloads/)
- Code IDE - preferably [Visual Studio](https://code.visualstudio.com/), [Vim](https://www.vim.org/)


## Installation Setup Steps

1. Create new database in MySQL.
2. Create a file name `.env` file in root folder
3. Copy the syntax from `.env-example` to `.env` and enter the information for MYSQL Database as below:

| Key                     | Description                                             | Example value                 |
| ----------------------- | ------------------------------------------------------- | ----------------------------- |
| MYSQL_HOST              | Path to MYSQL instance                                  | `localhost`                   |
| MYSQL_DB                | Name of the DB                                          | `obkreno`                     |
| MYSQL_USERNAME          | username                                                | `root`                        |
| MYSQL_PASSWORD          | password                                                | ` `                           |
| STORAGE_PROVIDER        | Optional, [Storage](#storage)                           | `aws`                         |
| STORAGE_PROVIDER_KEY_ID | Optional, [Storage](#storage)                           |                               |
| STORAGE_PROVIDER_KEY    | Optional, [Storage](#storage)                           |                               |
| STORAGE CONTAINER       | Optional, [Storage](#storage)                           |                               |

4. Run command `npm ci`
5. Run command `npm run build`
6. Run command `npm run migrate`
7. Run command `npm start`

[Back to top](#documentation)

## Database

Database: MySQL

The model is built with SQL-query in mind. To change it, u need to update the datasource.

[Back to top](#documentation)

## Database Migration

Database migration is a process to migrate models to database tables or collections.
When a migration is finished, the dataset in the source databases resides in target databases.

Auto-migration helps the user create relational database schemas based on definitions of their models together with their relation.

**Reference**
https://loopback.io/doc/en/lb4/Database-migrations.html

**Create a new migration**

1. Create models
2. Create repository
3. Add model in `migrate.ts`

**Run migration**

```
npm run build
npm run migrate
```

[Back to top](#documentation)

## File Storage

To reduce system complexity, the framework use cloud-based storage.

**Reference**
[Loopback-storage-components](https://loopback.io/doc/en/lb3/Storage-component.html)

#### Using Cloud provider (AWS)

1. Go to [file.datasource.ts](), and **change** code for `const config` to below

```js
const config = {
  name: 'File',
  connector: 'loopback-component-storage',
  provider: 'aws',
  key: <AWS_KEY>,
  keyId: <AWS_KEY_PROVIDER>,
  nameConflict: 'makeUnique',
  makeUnique: true,
};
```

To get AWS_KEY you'll will need to register and go to [AWS Console](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

#### Using Filesystem

To change to to local storage follow step belows:

1. In root, create a new folder named `storage`
2. Change directory inside `./storage` and create another folder name similar as **STORAGE CONTAINER**
3. Go to [file.datasource.ts](), and **change** code for `const config` to below

```js
const config = {
  name: 'File',
  connector: 'loopback-component-storage',
  provider: 'filesystem',
  root: './storage',
};
```

4. Run application

[Back to top](#documentation)
