import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {authenticator} from 'otplib';

@bind({scope: BindingScope.TRANSIENT})
export class OtpService {
  constructor(/* Add @inject to inject parameters */) {}

  private secret: string = process.env.OTP_SECRET ?? '';

  getOTPCode(): string {
    return authenticator.generate(this.secret);
  }

  verifyOTP(token: string, date: Date): boolean {
    const time = new Date().getTime() - date.getTime();

    const validity: string = process.env.OTP_VALIDITY ?? '0';
    if (time > parseInt(validity)) {
      return false;
    }

    return authenticator.check(token, this.secret);
  }
}
