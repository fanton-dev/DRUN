import {PaymentExport} from '@core/@types/entity-exports';
import {OrderModel} from '@core/@types/models';
import {PaymentApi} from '@core/@types/payment-api';
import {SharedQueue} from '@core/@types/shared-queue';
import makePayment from '@src/payment';
import config from 'config';

/**
 * Handles a user payment from a credit/debit card and notifies
 * the delivery service about it.
 *
 * @export
 * @param {{
 *   paymentApi: PaymentApi,
 *   sharedQueue: SharedQueue,
 *   paymentsDatabase: PaymentDatabaseController,
 *   exportToNormalEntity: Function,
 * }} {
 *   paymentApi,
 *   sharedQueue,
 *   paymentsDatabase,
 *   exportToNormalEntity,
 * } - dependency injection
 * @return {Function} - payment creation function
 */
export default function buildCreatePayment({
  paymentApi,
  sharedQueue,
}: {
  paymentApi: PaymentApi;
  sharedQueue: SharedQueue;
}): Function {
  return async function createPayment(orderInfo: OrderModel) {
    // Internal parameter
    let payment: PaymentExport;

    try {
      payment = makePayment({
        orderId: orderInfo.id,
        paymentCardToken: orderInfo.paymentCardToken,
      });

      await paymentApi.charge(
          payment.getPaymentCardToken(),
          `DRUN Delivery shipping tax (${payment.getOrderId()}).`,
      );
      payment.markAsCompleted();
    } catch (e) {
      sharedQueue.emit([
        config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'PAYMENT_DECLINED',
        body: {orderId: orderInfo.id, error: e.message},
      });
      return;
    }

    // Emitting an 'PAYMENT_APPROVED' event in shared queue on valid payment
    sharedQueue.emit([
      config.get('INBOUND_DELIVERY_SERVICE_QUEUE'),,
      config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
    ], {
      subject: 'PAYMENT_APPROVED',
      body: payment,
    });
  };
}
