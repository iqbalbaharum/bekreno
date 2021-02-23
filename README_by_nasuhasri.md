## Krenovator LMS System (Open Source)

## Overview
Krenovator LMS is a project built by students of Krenovator. It is made to enhance 
the understanding of students in real project developed in production level.

## System Requirement
Make sure you have all these installed first in your local machine:

- [Git Bash]           - to ensure you can use git command
- [Xampp / Laragon]    - any of these that suits you 
- [NodeJS]             - backend framework
- [Visual Studio Code] - or any text editor that you prefer

## Getting Started & Installation
1. Open your github and fork these repos:
   - https://github.com/iqbalbaharum/bekreno
   - https://github.com/iqbalbaharum/fekreno

2. Create new folder and open git bash

3. Copy link of the repos in your github. Make sure your directory is correct
   then insert this command without the open and close tag.
   Command: git clone <link-of-the-repos>
   Example path: C:\Users\nasuha\Desktop\proKreno>

## Bekreno
1. Open terminal and go to bekreno folder
   Command: cd bekreno

2. Setup the .env file - Refer ## Configuration File

3. Install all dependencies at backend:
   Command: npm ci

4. Create database in Xampp/Laragon. Make sure db name same as in
   the .env file

5. Setup database
   Command: npm run build

6. Migrate database into your local machine
   Command: npm run migrate
   
7. To run the backend: npm start

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