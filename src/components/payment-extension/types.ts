import {BindingTemplate, extensionFor} from '@loopback/core';

/**
 * Name/id of the payment extension point
 */
export const PAYMENT_EXTENSION_POINT_NAME = 'payments';

export interface PaymentProvider {
  provider: string;
  checkout(): string;
}

/**
 * A binding template for payment extensions
 */
export const asPaymentProvider: BindingTemplate = binding => {
  extensionFor(PAYMENT_EXTENSION_POINT_NAME)(binding);
  binding.tag({namespace: 'payments'});
};
