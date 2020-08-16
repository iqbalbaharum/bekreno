import {bind, BindingScope} from '@loopback/core';
import {authenticator} from 'otplib';

@bind({scope: BindingScope.TRANSIENT})
export class OtpService {
  constructor() {}

  private secret: string = process.env.OTP_SECRET ?? '';

  getOTPCode(): string {
    return authenticator.generate(this.secret);
  }

  verifyOTP(token: string, createdAt: Date): boolean {
    const time = new Date().getTime() - createdAt.getTime();
    const validity = parseInt(process.env.OTP_VALIDITY ?? '0');

    if (time > validity) {
      return false;
    }

    return authenticator.check(token, this.secret);
  }
}
