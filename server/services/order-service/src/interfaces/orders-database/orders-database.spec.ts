import makeOrdersDatabase from './orders-database';
import makeFakeOrder from '../../../test/fixtures/order';
import makeOrder, {decompressOrder} from '../../entities/order';
import makeFakeDatabaseClient from '../../../test/fixtures/database-client';
import {DatabaseController} from '../../../../core/@types/global';


describe('order-database', () => {
  let ordersDatabase: DatabaseController;
  const order = decompressOrder(makeOrder(makeFakeOrder()));
  const databaseClient = makeFakeDatabaseClient(order);

  beforeEach(async () => {
    ordersDatabase = makeOrdersDatabase({
      databaseClient: databaseClient,
      databaseTable: 'orders',
    });
  });

  it('inserts an order', async () => {
    const result = await ordersDatabase.insert(order);
    expect(result).toEqual(order.id);
  });

  it('finds an order by id', async () => {
    // eslint-disable-next-line no-unused-vars
    const {paymentCard, ...orderWithoutPaymentCard} = order;

    await ordersDatabase.insert(order);
    const found = await ordersDatabase.findById(order.id);
    expect(found).toEqual(orderWithoutPaymentCard);
  });
});
