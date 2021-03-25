import Stripe from 'stripe';
import {PaymentCardModel} from './models';

/**
 * Payment API object structure.
 *
 * @exports
 * @interface PaymentApi
 */
export interface PaymentApi {
  paymentCardToToken(
    paymentCard: PaymentCardModel,
  ): Promise<string>;

  charge(
    token: string,
    description: string,
  ): Promise<Stripe.Response<Stripe.Charge>>;
}
