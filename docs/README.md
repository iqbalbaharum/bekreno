## Prescribed by nasuhasri

## Krenovator LMS System (Open Source)

## Overview
Krenovator LMS is a project built by students of Krenovator. It is made to enhance 
the understanding of students in real project developed in production level.

## Framework
   1. Frontend - [Quasar framework](https://quasar.dev/).
   2. Backend - Node framework which is [IBM LoopBack Version 4](https://loopback.io/).

## Database
Database used in this project: MySQL

## System Requirement
Make sure you have all these installed first in your local machine:

- [Git Bash]           - to ensure you can use git command
- [Xampp / Laragon]    - any of these that suits you 
- [NodeJS]             - backend framework; so you can use npm command
- [Visual Studio Code] - or any text editor that you prefer

## Friendly Reminder
If you are a beginner in LoopBack framework or Quasar Framework, it is highly recommend for you 
to do [this tutorial for LoopBack framework](https://loopback.io/doc/en/lb4/Tutorials.html) and [video tutorial for Quasar framework](https://quasar.dev/video-tutorials).

## Getting Started & Installation
1. Open your github and fork these repos:
   - https://github.com/iqbalbaharum/bekreno
   - https://github.com/iqbalbaharum/fekreno

2. Create new folder and open git bash

3. Copy link of the repos in your github. Make sure your directory is correct then insert this command with the link of repo.
   - Command: *git clone link-of-repo*.
   - Example path: C:\Users\nasuha\Desktop\proKreno>

## Bekreno Installation
1. Open terminal and go to bekreno folder.
   Command: *cd bekreno*

2. Setup the .env file. Env file is a file used to define some variables according to the application's environment.
   - Refer ## Configuration File
   - For more information about .env file, you can refer here <https://www.freecodecamp.org/news/nodejs-custom-env-files-in-your-apps-fa7b3e67abe1/>

3. Install all dependencies at backend.
   - Command: *npm ci*

4. Create database in Xampp/Laragon. Make sure db name same as in the .env file.
   - *Xampp/Laragon is a web server that helps developers to test the application locally in our machine*.

5. Setup database.
   - Command: *npm run build*

6. Migrate database into your local machine - it will create all tables needed in our newly created database.
   - Command: *npm run migrate*
   
7. To run the backend: *npm start*

8. Result:

![Backend Interface](docs/images/backend.jpg "Backend Interface")

## Configuration File

1. Create a file name `.env` file in root folder.
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

3. For ## Storage Provider, you can use any cloud providers as well as your local file system.
   This is a place where data from the application will be saved.

[1]: Using Local File System.
   1. In root of bekreno folder, create a folder named `storage`.
   2. In storage folder, create another folder named **STORAGE CONTAINER**.
   3. Go to [file.datasource.ts] and change code `const config` to these: 

      ```js
         const config = {
            name: 'File',
            connector: 'loopback-component-storage',
            provider: 'filesystem',
            root: './storage',
         };
      ```
[2]: Using Cloud Provider (AWS)
   1. Go to [file.datasource.ts] and change code `const config` to these:

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
## Side Note
1. Please ensure # MYSQL Database have values in .env file.
2. Please ensure # Storage Provider has key values. If you're using local file system, 
   please ensure you have config the file accordingly.

