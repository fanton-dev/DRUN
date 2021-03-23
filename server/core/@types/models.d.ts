/**
 * OrderModel object structure.
 *
 * @interface OrderModel
 */
export interface OrderModel {
  id?: string;
  sender: PersonModel;
  receiver: PersonModel;
  paymentCardToken: String;
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
  token: string;
  phoneNumber: string;
  createdAt?: string;
}

