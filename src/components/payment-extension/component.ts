import {Binding, Component, createBindingFromClass} from '@loopback/core';
import {PAYMENT_SERVICE} from './keys';
import {PaymentService} from './payment-service';
import {BillplzPaymentProvider} from './provider/provider-billplz';

export class PaymentExtensionPointComponent implements Component {
  bindings: Binding[] = [
    createBindingFromClass(PaymentService, {
      key: PAYMENT_SERVICE,
    }),
    createBindingFromClass(BillplzPaymentProvider),
  ];
}
