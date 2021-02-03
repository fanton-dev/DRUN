import {
  SharedQueue,
  PaymentApi,
  Order,
  PaymentExport,
  PaymentDatabaseController,
  Payment,
} from '../../../core/@types/global';
import config from '../../../core/config';
import {exportToNormalEntity} from '../../../core/entities/utilities';
import makePayment from '../entities/payment';

/**
 * Handles a user payment from a credit/debit card, stores data about the
 * payment and notifies the delivery service about it.
 *
 * @export
 * @param {{sharedQueue: SharedQueue, paymentsDatabase: DatabaseController}} {
 *    paymentApi
 *   sharedQueue,
 *   paymentsDatabase,
 * } - dependency injection
 * @return {Function} - payment creation function
 */
export default function buildCreatePayment({
  paymentApi,
  sharedQueue,
  paymentsDatabase,
}: {
  paymentApi: PaymentApi;
  sharedQueue: SharedQueue;
  paymentsDatabase: PaymentDatabaseController;
}): Function {
  return async function createPayment(orderInfo: Order) {
    // Internal parameter
    let payment: PaymentExport;

    // Emitting an 'PAYMENT_DECLINED' event in shared queue on invalid payment
    try {
      // Creating payment entity
      payment = makePayment({
        orderId: orderInfo.id,
        paymentCard: orderInfo.paymentCard,
      });

      // Processing payment
      payment.setPaymentCardToken(
          await paymentApi.paymentCardToToken(
              exportToNormalEntity(payment.getPaymentCard()),
          ),
      );

      await paymentApi.charge(
          // @ts-ignores ts(2345) - error because possible undefined; set in
          // previous call
          payment.getPaymentCardToken(),
          `DRUN Delivery shipping tax (${payment.getOrderId()}).`,
      );
      payment.markAsCompleted();
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'PAYMENT_DECLINED',
        body: e.message,
      });
      throw e;
    }

    // Normalizing the entity
    const paymentNormalized: Payment = exportToNormalEntity(payment);

    // Emitting an 'PAYMENT_APPROVED' event in shared queue on valid payment
    sharedQueue.emit([
      config.inboundDeliveryServiceQueue,
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'PAYMENT_APPROVED',
      body: paymentNormalized,
    });

    // Creating an entry in local database
    return paymentsDatabase.insert(paymentNormalized);
  };
}
