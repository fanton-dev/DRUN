import {
  PaymentApi,
  PaymentApiCharge,
  PaymentCard,
  PaymentLibrary,
} from '../../../../core/@types/global';

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
export default function makePaymentApi({
  paymentLibrary,
  shippingCharge,
}: {
    paymentLibrary: PaymentLibrary,
    shippingCharge: number,
  }): PaymentApi {
  /**
   * Generates a stripe token for payment card.
   *
   * @param {PaymentCard} paymentCard - Payment card used for generation
   * @return {Promise<string>}
   */
  async function paymentCardToToken(
      paymentCard: PaymentCard,
  ): Promise<string> {
    const [expMonth, expYear] = paymentCard.date.split('/', 2);
    const token = await paymentLibrary.tokens.create({
      card: {
        number: paymentCard.number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: paymentCard.CVC,
      },
    });
    return token.id;
  }

  /**
   * Processes a stripe payment.
   *
   * @param {string} token - Payment card token
   * @param {string} description - Transaction description
   * @return {PaymentApiCharge}
   */
  async function charge(
      token: string,
      description: string,
  ): Promise<PaymentApiCharge> {
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
