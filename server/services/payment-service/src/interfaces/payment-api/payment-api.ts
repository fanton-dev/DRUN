import {
  PaymentApi,
  PaymentApiResponse,
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
   * @param {PaymentCard} paymentCard - card used for generation
   * @return {Promise<PaymentApiResponse>}
   */
  async function paymentCardToToken(
      paymentCard: PaymentCard,
  ): Promise<PaymentApiResponse> {
    const [expMonth, expYear] = paymentCard.date.split('/', 2);
    return paymentLibrary.tokens.create({
      card: {
        number: paymentCard.number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: paymentCard.CVC,
      },
    });
  }

  /**
   * Processes a stripe payment.
   *
   * @param {string} token
   * @param {string} description
   * @return {PaymentApiResponse}
   */
  async function charge(
      token: string,
      description: string,
  ): Promise<PaymentApiResponse> {
    return paymentLibrary.charges.create({
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
