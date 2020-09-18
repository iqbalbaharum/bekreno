import {bind} from '@loopback/core';
import {asPaymentProvider, PaymentProvider} from '../types';

@bind(asPaymentProvider)
export class BillplzPaymentProvider implements PaymentProvider {
  provider = 'billplz';

  checkout(): string {
    return '';
  }
}
