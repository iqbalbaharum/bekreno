import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {authenticator} from 'otplib';

@bind({scope: BindingScope.TRANSIENT})
export class OtpService {
  constructor(/* Add @inject to inject parameters */) {}

  secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

  getOTPCode(): string {
    return authenticator.generate(this.secret);
  }

  verifyOTP(token: string, date: Date): boolean {
    const time = new Date().getTime() - date.getTime();

    if (time > 180000) {
      return false;
    }

    return authenticator.check(token, this.secret);
  }
}
