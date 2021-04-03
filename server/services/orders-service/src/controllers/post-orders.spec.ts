import buildFakeOrder from '../../test/fixtures/order';
import buildPostOrder from './post-orders';

describe('post-orders controller', () => {
  it('must pass on a valid order', async () => {
    const postOrder = buildPostOrder({createOrder: (c: any) => c});
    const order = buildFakeOrder();
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
      headers: {'Content-Type': 'application/json'},
      statusCode: 201,
      body: request.body,
    };
    const actual = await postOrder(request);
    console.log(actual);
    console.log(expected);
    expect(actual).toEqual(expected);
  });

  it('must report user errors', async () => {
    const postOrder = buildPostOrder({
      createOrder: () => {
        throw Error('Kabum, Bam Bum, i NPMG izchezna!');
      },
    });
    const fakeOrder = buildFakeOrder();
    const request = {
      headers: {
        'Content-Type': 'application/json',
        'Referer': fakeOrder.source.referrer,
        'User-Agent': fakeOrder.source.browser,
      },
      body: fakeOrder,
    };
    const expected = {
      headers: {'Content-Type': 'application/json'},
      statusCode: 400,
      body: {error: 'Kabum, Bam Bum, i NPMG izchezna!'},
    };
    const actual = await postOrder(request);
    expect(actual).toEqual(expected);
  });
});
