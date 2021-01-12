import {default as val} from '.';

describe('validator.validateIdentifier', () => {
  it('must pass on valid identifier', () => {
    expect(() => val.validateIdentifier(
        'f0a1889b-da86-4365-9007-08b86c50fc9a',
    )).not.toThrow();
  });

  it('must find undefined identifier', () => {
    expect(() => val.validateIdentifier(null))
        .toThrow('Identifier not defined.');
  });
  it('must find invalid identifier', () => {
    expect(
        () => val.validateIdentifier('sthinvalid88'),
    ).toThrow('Identifier passed is invalid.');
  });
});

describe('validator.validateLocation', () => {
  it('must pass on valid location', () => {
    expect(() => val.validateLocation(
        {latitude: '23.22', longitude: '43.33'},
    )).not.toThrow();
  });

  it('must find undefined location', () => {
    expect(() => val.validateLocation(null)).toThrow('Location not defined.');
  });

  it('must find undefined location latitude', () => {
    expect(() => val.validateLocation(
        {latitude: null, longitude: '43.33'},
    )).toThrow('Location must have a latitude defined.');
  });

  it('must find undefined location longitude', () => {
    expect(() => val.validateLocation(
        {latitude: '23.33', longitude: null},
    )).toThrow('Location must have a longitude defined.');
  });

  it('must find non-numeric location latitude', () => {
    expect(() => val.validateLocation(
        {latitude: 'gosho', longitude: '43.33'},
    )).toThrow('Location latitude must be a number.');
  });

  it('must find non-numeric location longitude', () => {
    expect(() => val.validateLocation(
        {latitude: '23.33', longitude: 'posho'},
    )).toThrow('Location longitude must be a number.');
  });

  it('must find invalid location latitude (below -90)', () => {
    expect(() => val.validateLocation(
        {latitude: '-90.1', longitude: '43.33'},
    )).toThrow('Latitude must be between -90 and 90.');
  });

  it('must find invalid location latitude (above 90)', () => {
    expect(() => val.validateLocation(
        {latitude: '90.1', longitude: '43.33'},
    )).toThrow('Latitude must be between -90 and 90.');
  });

  it('must find invalid location longitude (below -180)', () => {
    expect(() => val.validateLocation(
        {latitude: '23.33', longitude: '-181'},
    )).toThrow('Longitude must be between -180 and 180');
  });

  it('must find invalid location longitude (above 180)', () => {
    expect(() => val.validateLocation(
        {latitude: '23.33', longitude: '181'},
    )).toThrow('Longitude must be between -180 and 180.');
  });
});


describe('validator.paymentCard', () => {
  it('must pass on valid card', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '12/68', CVC: '666'},
    )).not.toThrow();
  });

  it('must find undefined card', () => {
    expect(() => val.validatePaymentCard(null)).toThrow('Card not defined.');
  });

  it('must find undefined card number', () => {
    expect(() => val.validatePaymentCard(
        {number: null, date: '12/68', CVC: '666'},
    )).toThrow('Card must have a number defined.');
  });

  it('must find undefined card date', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: null, CVC: '666'},
    )).toThrow('Card must have a date defined.');
  });

  it('must find undefined card CVC', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '12/68', CVC: null},
    )).toThrow('Card must have a CVC defined.');
  });

  it('must find invalid card number (containing non-digits)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 424a', date: '12/68', CVC: '666'},
    )).toThrow('Card number can only have numbers.');
  });

  it('must find invalid card number (not 16 digits)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 424', date: '12/68', CVC: '666'},
    )).toThrow('Card number must contain 16 digits.');
  });

  it('must find invalid card date (format)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '13/68', CVC: '666'},
    )).toThrow('Card date must be in MM/YY format.');
  });

  it('must find invalid card date (expired)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '12/18', CVC: '666'},
    )).toThrow('Card date must not have expired.');
  });

  it('must find invalid card CVC (containing non-digits)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '12/68', CVC: '69a'},
    )).toThrow('Card CVC can only contain numbers.');
  });

  it('must find invalid card CVC (not 3 digits)', () => {
    expect(() => val.validatePaymentCard(
        {number: '4242 4242 4242 4242', date: '12/68', CVC: '6969'},
    )).toThrow('Card CVC must contain 3 digits.');
  });
});
