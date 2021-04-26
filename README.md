<!-- # Krenovator LMS System (Open Source)

### Introduction

Krenovator LMS (backend) is a collaborative learning platform.

## Documentation

- [System requirements](#system-requirements)
- [Installation](#installation)
- [Configuration File](#configuration-file)
  - [Database](#database)
  - [Storage](#file-storage)
  - [SMTP - Simple Mail Transfer Protocol](#smtp)
- [Database Migration](#database-migration)
- [System Architecture]()
- [Troubleshooting](#)

## System Requirements

- [NodeJS v12 or higher](https://nodejs.org/en/)
- [MySQL](https://dev.mysql.com/downloads/)
- Code IDE - preferably [Visual Studio](https://code.visualstudio.com/), [Vim](https://www.vim.org/)
- [IBM Loopbackframework - Version Loopback 4](https://loopback.io/doc/en/lb4/Concepts.html)
- [AWS Cloud S3](https://aws.amazon.com/)
- [SMTP Access](https://developers.google.com/gmail/imap/imap-smtp)

## Installation

1. `git clone`
2. `npm ci`

[Back to top](#documentation)

## Configuration File

1. Create a file name `.env` file in root folder
2. Copy the syntax from `.env-example` to `.env` and enter the information as below:

| Key                     | Description                                             | Example value                 |
| ----------------------- | ------------------------------------------------------- | ----------------------------- |
| NODE_ENV                | General code environment                                | `production` or `development` |
| TOKEN_SECRET            | JWT hasing salt                                         | `mylocal`                     |
| TOKEN_VALIDITY          | JWT Expiration in milliseconds                          | `21600`                       |
| MYSQL_HOST              | Path to MYSQL instance                                  | `localhost`                   |
| MYSQL_DB                | Name of the DB                                          | `obkreno`                     |
| MYSQL_USERNAME          | username                                                | `root`                        |
| MYSQL_PASSWORD          | password                                                | ` `                           |
| SMTP_HOST               | Handle outgoing email [SMTP](#smtp)                     | `any@email.com`               |
| SMTP_SECURE             | Handle outgoing email [SMTP](#smtp)                     | `true` @ `false`              |
| SMTP_PORT               | Handle outgoing email [SMTP](#smtp)                     | `465`                         |
| SMTP_USERNAME           | Handle outgoing email [SMTP](#smtp)                     | ` `                           |
| SMTP_PASSWORD           | Handle outgoing email [SMTP](#smtp)                     | ` `                           |
| OTP_ENABLE              | Enable OTP (one-time-password) login                    | `0` or `1`                    |
| SMS_URL                 | If OTP_ENABLE=1, SMS provider detail (optional)         |                               |
| SMS_API                 | If OTP_ENABLE=1, SMS Api Key (optional)                 |                               |
| SMS_TAG                 | If OTP_ENABLE=1, SMS Tag (optional)                     |                               |
| OTP_SECRET              | If OTP_ENABLE=1, OTP code generation secret (optional)  |                               |
| OTP_VALIDITY            | Define how long the token will be valid in milliseconds |                               |
| ONESIGNAL_APPID         | Optional, [OneSignal](https://onesignal.com/)           |                               |
| ONESIGNAL_APPKEY        | Optional, [OneSignal](https://onesignal.com/)           |                               |
| STORAGE_PROVIDER        | Optional, [Storage](#storage)                           | `aws`                         |
| STORAGE_PROVIDER_KEY_ID | Optional, [Storage](#storage)                           |                               |
| STORAGE_PROVIDER_KEY    | Optional, [Storage](#storage)                           |                               |
| STORAGE CONTAINER       | Optional, [Storage](#storage)                           |                               |

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
 -->

 To configure LMS Krenovator

## Tools used to configure
<ol>
<li>XAMPP</li>
<li>CODE EDITOR(Sublime Text)</li>
<li>GIT</li>
</ol>

## Step to deploy LMS Krenovator
1. Using Git Bash
2. git clone fekreno at ```https://github.com/iqbalbaharum/fekreno.git```
3. git clone bekreno at ```https://github.com/iqbalbaharum/bekreno.git```

4. Create new file ".env" in fekreno folder and bekreno folder.

5. Copy the bekreno and fekreno respective as in [APPENDIX](#appendix).

6. Run XAMPP (I am using XAMPP as a MySQL database server)
7. Open MySQL Admin, create new database and name it "lms", press "create" button


## 8. Open bekreno folder using CMD
9. enter "npm ci"
10. enter "npm run build"
11. enter "npm run migrate"
12. enter "npm start" 

## 13. Open fekreno folder using CMD
14. enter "npm ci"
15. enter "quasar dev"

16. if any, can refer to this [source](https://www.youtube.com/watch?v=x1ul9e8iXa4)


## APPENDIX
```js
#for bekreno

# OTP
OTP_ENABLE=0
SMS_URL=
SMS_API=
SMS_TAG=
OTP_SECRET=

# In milliseconds
OTP_VALIDITY=18000

# JWT Token
TOKEN_SECRET=mylocal
TOKEN_VALIDITY=21600

# MYSQL Database
MYSQL_HOST=localhost
MYSQL_DB=lms
MYSQL_USERNAME=root
MYSQL_PASSWORD=

#SMTP
SMTP_HOST=any@email.com
SMTP_SECURE=true
SMTP_PORT=465
SMTP_USERNAME=
SMTP_PASSWORD=

ONESIGNAL_APPID=
ONESIGNAL_APPKEY=

BILLPLZ_SECRET=

# STORAGE PROVIDER
STORAGE_PROVIDER=amazon
STORAGE_PROVIDER_KEY_ID=
STORAGE_PROVIDER_KEY=
STORAGE_CONTAINER=krenolms

```
 
```js
#for fekreno
MAIN_BE_URL=http://localhost:3000
MAIN_BE_TOKEN=jwt

```