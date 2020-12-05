/**
 * Provides a fake orders entity for testing.
 *
 * @export
 * @param {*} overrides
 * @return {*}
 */
export default function makeFakeOrder(overrides) {
  const order = {
    sender: {
      id: 'rjLoRaOHh1FZ2r4s16OkLO58siXf',
      location: {
        latitude: 43.33,
        longitude: 22.22,
      },
    },
    receiver: {
      id: 'cka7djgczqclceu80001iooy5',
      location: {
        latitude: 43.40,
        longitude: 22.32,
      },
    },
    paymentCard: {
      number: '4242 4242 4242 4242',
      date: '12/68',
      CVC: '420',
    },
  };

  return {
    ...order,
    ...overrides,
  };
}
