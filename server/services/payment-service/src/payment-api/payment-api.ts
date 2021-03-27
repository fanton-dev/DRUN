import {PaymentCardModel} from '@core/@types/models';
import {PaymentApi} from '@core/@types/payment-api';
import Stripe from 'stripe';

/**
 * Payment API interactions interface.
 *
 * @export
 * @param {{
 *     paymentLibrary: PaymentLibrary,
 *     shippingCharge: number,
 *   }} {
 *   paymentLibrary,
 *   shippingCharge,
 * } - dependency injection
 * @return {PaymentApi}
 */
export default function buildPaymentApi({
  paymentLibrary,
  shippingCharge,
}: {
    paymentLibrary: Stripe,
    shippingCharge: number,
  }): PaymentApi {
  /**
   * Generates a stripe token for payment card.
   *
   * @param {PaymentCard} paymentCard - payment card used for generation
   * @return {Promise<string>} - payment card token
   */
  async function paymentCardToToken(
      paymentCard: PaymentCardModel,
  ): Promise<string> {
    const [expMonth, expYear] = paymentCard.date.split('/', 2);
    const token = await paymentLibrary.tokens.create({
      card: {
        number: paymentCard.number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: paymentCard.cvc,
      },
    });
    return token.id;
  }

  /**
   * Processes a stripe payment.
   *
   * @param {string} token - payment card token
   * @param {string} description - transaction description
   * @return {Stripe.Response<Stripe.Charge>} - stripe charge
   */
  async function charge(
      token: string,
      description: string,
  ): Promise<Stripe.Response<Stripe.Charge>> {
    return await paymentLibrary.charges.create({
      source: token,
      amount: shippingCharge,
      currency: 'bgn',
      description: description,
    });
  }

  return Object.freeze({
    paymentCardToToken: paymentCardToToken,
    charge: charge,
  });
}
