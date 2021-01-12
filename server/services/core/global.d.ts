import {ParamsDictionary, Request, Response} from 'express-serve-static-core';

/**
 * Validator object structure.
 *
 * @interface Validator
 */
interface Validator {
  validateIdentifier: (identifier: string) => void,
  validateLocation: (location: Location) => void,
  validateRoute: (
    homeLocation: Location,
    senderLocation: Location,
    receiverLocation: Location,
    maxDistance: number,
  ) => number,
  validatePaymentCard: (paymentCard: PaymentCard) => void
}

/**
 * Location object structure.
 *
 * @interface Location
 */
interface Location {
  latitude: number,
  longitude: number
}

/**
 * Sender/Receiver object structure.
 *
 * @interface Person
 */
interface Person {
  id: string,
  location: Location,
}

/**
 * PaymentCard object structure.
 *
 * @interface PaymentCard
 */
interface PaymentCard {
  number: string,
  date: string,
  CVC: string
}

/**
 * Request Source object structure.
 *
 * @interface Source
 */
interface Source {
  ip: string,
  browser: string,
  referrer: string,
}

/**
 * Source export object structure.
 *
 * @interface SourceExport
 */
interface SourceExport {
  getIp: () => string,
  getBrowser: () => string,
  getReferrer: () => string
}

/**
 * Order object structure.
 *
 * @interface Order
 */
interface Order {
  sender: Person,
  receiver: Person,
  paymentCard: PaymentCard,
}

/**
 * Payment object structure.
 *
 * @interface Payment
 */
interface Payment {
  orderId: string,
  paymentCard: PaymentCard
}

/**
 * Drone object structure.
 *
 * @interface Drone
 */
interface Drone {
  droneSource: Source,
  homeLocation: Location
}

/**
 * Drone export object structure.
 *
 * @interface DroneExport
 */
interface DroneExport {
    getId: () => string,
    getDroneSource: () => Source,
    getHomeLocation: () => Location,
    getIsBusy: () => boolean,
    getDrone: () => DroneExport,
    getConnectedOn: () => number,
    markAsBusy: Function,
    markAsNotBusy: Function,
}

export {
  Validator,
  Location,
  Person,
  PaymentCard,
  Source,
  SourceExport,
  Order,
};
