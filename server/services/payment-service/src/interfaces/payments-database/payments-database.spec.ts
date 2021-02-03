import makePaymentsDatabase from './payments-database';
import makeFakePayment from '../../../test/fixtures/payment';
import makePayment from '../../entities/payment';
import makeFakeDatabaseClient from '../../../test/fixtures/database-client';
import {
  Payment,
  PaymentDatabaseController,
  PaymentExport,
} from '../../../../core/@types/global';
import {exportToNormalEntity} from '../../../../core/entities/utilities';


describe('payment-database', () => {
  let paymentsDatabase: PaymentDatabaseController;
  const paymentExport = makePayment(makeFakePayment());
  paymentExport.setPaymentCardToken('tok_1IG38FFW07knbpCOuaVOb7R7');
  paymentExport.markAsCompleted();

  const payment = exportToNormalEntity<PaymentExport, Payment>(paymentExport);
  const databaseClient = makeFakeDatabaseClient(payment);

  beforeEach(async () => {
    paymentsDatabase = makePaymentsDatabase({
      databaseClient: databaseClient,
      databaseTable: 'payments',
    });
  });

  it('inserts an payment', async () => {
    const result = await paymentsDatabase.insert(payment);
    expect(result).toEqual({id: payment.id});
  });

  it('finds an payment by id', async () => {
    // eslint-disable-next-line no-unused-vars
    const {paymentCard, ...paymentWithoutPaymentCard} = payment;

    await paymentsDatabase.insert(payment);
    const found = await paymentsDatabase.findById(payment.id);
    expect(found).toEqual(paymentWithoutPaymentCard);
  });
});
