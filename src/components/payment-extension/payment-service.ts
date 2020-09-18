import {config, extensionPoint, extensions, Getter} from '@loopback/core';
import {PaymentProvider, PAYMENT_EXTENSION_POINT_NAME} from './types';

export interface PaymentServiceOptions {}

@extensionPoint(PAYMENT_EXTENSION_POINT_NAME)
export class PaymentService {
  constructor(
    @extensions()
    private getPaymentProvider: Getter<PaymentProvider[]>,

    @config()
    public readonly options?: PaymentServiceOptions,
  ) {}

  async findPaymentProvider(
    provider: string,
  ): Promise<PaymentProvider | undefined> {
    const providers = await this.getPaymentProvider();
    return providers.find(element => element.provider === provider);
  }

  // Override Method
}
