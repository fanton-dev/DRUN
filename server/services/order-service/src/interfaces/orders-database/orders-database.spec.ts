import makeOrdersDatabase from './orders-database';
import makeFakeOrder from '../../../test/fixtures/order';
import makeOrder from '../../entities/order';
import makeFakeDatabaseClient from '../../../test/fixtures/database-client';
import {
  Order,
  OrderDatabaseController,
  OrderExport,
} from '../../../../core/@types/global';
import {exportToNormalEntity} from '../../../../core/entities/utilities';


describe('order-database', () => {
  let ordersDatabase: OrderDatabaseController;
  const order = exportToNormalEntity<OrderExport, Order>(
      makeOrder(makeFakeOrder()),
  );
  const databaseClient = makeFakeDatabaseClient(order);

  beforeEach(async () => {
    ordersDatabase = makeOrdersDatabase({
      databaseClient: databaseClient,
      databaseTable: 'orders',
    });
  });

  it('inserts an order', async () => {
    const result = await ordersDatabase.insert(order);
    expect(result).toEqual({id: order.id});
  });

  it('finds an order by id', async () => {
    // eslint-disable-next-line no-unused-vars
    const {paymentCard, ...orderWithoutPaymentCard} = order;

    await ordersDatabase.insert(order);
    const found = await ordersDatabase.findById(order.id);
    expect(found).toEqual(orderWithoutPaymentCard);
  });
});
