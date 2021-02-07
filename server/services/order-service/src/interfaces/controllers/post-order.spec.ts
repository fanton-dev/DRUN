import makePostOrder from './post-order';
import makeFakeOrder from '../../../test/fixtures/order';

describe('post-order controller', () => {
  it('must pass on a valid order', async () => {
    const postOrder = makePostOrder({createOrder: (c: any) => c});
    const order = makeFakeOrder();
    const request = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': order.source.referrer,
        'User-Agent': order.source.browser,
      },
      body: order,
      ip: order.source.ip,
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 201,
      body: {order: request.body},
    };
    const actual = await postOrder(request);
    expect(actual).toEqual(expected);
  });

  it('must report user errors', async () => {
    const postOrder = makePostOrder({
      createOrder: () => {
        throw Error('Kabum, Bam Bum, i NPMG izchezna!');
      },
    });
    const fakeOrder = makeFakeOrder();
    const request = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': fakeOrder.source.referrer,
        'User-Agent': fakeOrder.source.browser,
      },
      body: fakeOrder,
    };
    const expected = {
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 400,
      body: {error: 'Kabum, Bam Bum, i NPMG izchezna!'},
    };
    const actual = await postOrder(request);
    expect(actual).toEqual(expected);
  });
});
