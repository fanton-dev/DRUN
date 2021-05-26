import {DroneExport} from './entity-exports';

/**
 * OrderModel object structure.
 *
 * @interface OrderModel
 */
export interface OrderModel {
  id?: string;
  sender: PersonModel;
  receiver: PersonModel;
  paymentCardToken: string;
  source: SourceModel;
  createdOn?: number;
}

/**
 * Sender/Receiver object structure.
 *
 * @exports
 * @interface PersonModel
 */
export interface PersonModel {
  id: string;
  location: LocationModel;
}

/**
 * LocationModel object structure.
 *
 * @exports
 * @interface LocationModel
 */
export interface LocationModel {
  latitude: number;
  longitude: number;
}

/**
 * Request Source object structure.
 *
 * @exports
 * @interface SourceModel
 */
export interface SourceModel {
  ip: string;
  browser: string;
  referrer: string;
}

/**
 * PaymentCardModel object structure.
 *
 * @exports
 * @interface PaymentCardModel
 */
export interface PaymentCardModel {
  number: string;
  date: string;
  cvc: string;
}

/**
 * UserModel object database schema.
 *
 * @export
 * @interface UserModel
 */
export interface UserModel {
  id?: string;
  token?: string;
  phoneNumber: string;
}

/**
 * PaymentModel object structure.
 *
 * @exports
 * @interface PaymentModel
 */
export interface PaymentModel {
  id?: string;
  orderId: string;
  paymentCardToken: string;
  createdOn?: number;
  completedOn?: number | undefined;
}

/**
 * DroneModel object structure.
 *
 * @exports
 * @interface DroneModel
 */
export interface DroneModel {
  id?: string;
  source: SourceModel;
  homeLocation: LocationModel;
  isBusy?: boolean;
  connectedOn?: number;
}

/**
 * DeliveryModel object structure.
 *
 * @exports
 * @interface DeliveryModel
 */
export interface DeliveryModel {
  id?: string;
  orderId: string;
  drone?: DroneExport;
  senderLocation: LocationModel;
  receiverLocation: LocationModel;
  createdOn?: number;
  completedOn?: number | undefined;
}
