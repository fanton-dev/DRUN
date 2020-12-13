import {default as val} from './';

describe('validator.validateLocation', () => {
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

/**
 * The three coordinate points specified in the unittest are in a total distance
 * of 4.58 km apart (Sofia Tech Park -> TUES -> TU (block 9) -> Sofia Tech Park)
*/
describe('validator.validateRoute', () => {
  it('must find invalid home location', () => {
    expect(() => val.validateRoute(
        {latitude: '42.666705', longitude: '888'},
        {latitude: '42.662388', longitude: '23.373416'},
        {latitude: '42.652900', longitude: '23.354952'},
        5.00,
    )).toThrow('Home location error:');
  });

  it('must find invalid sender location', () => {
    expect(() => val.validateRoute(
        {latitude: '42.666705', longitude: '23.374919'},
        {latitude: '42.662388', longitude: null},
        {latitude: '42.652900', longitude: '23.354952'},
        5.00,
    )).toThrow('Sender location error:');
  });

  it('must find invalid receiver location', () => {
    expect(() => val.validateRoute(
        {latitude: '42.666705', longitude: '23.374919'},
        {latitude: '42.662388', longitude: '23.373416'},
        {latitude: '42.652900', longitude: 'gosho'},
        5.00,
    )).toThrow('Receiver location error:');
  });
  it('must accept a valid route', () => {
    expect(val.validateRoute(
        {latitude: '42.666705', longitude: '23.374919'},
        {latitude: '42.662388', longitude: '23.373416'},
        {latitude: '42.652900', longitude: '23.354952'},
        5.00,
    )).toBeCloseTo(4.58);
  });

  it('must decline an invalid route', () => {
    expect(() => val.validateRoute(
        {latitude: '42.666705', longitude: '23.374919'},
        {latitude: '42.662388', longitude: '23.373416'},
        {latitude: '42.652900', longitude: '23.354952'},
        4.00,
    )).toThrow();
  });
});
