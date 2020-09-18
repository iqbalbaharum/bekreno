import {BindingKey} from '@loopback/core';
import {PaymentService} from './payment-service';

export const PAYMENT_SERVICE = BindingKey.create<PaymentService>(
  'services.PaymentService',
);
