import {LocationModel, PaymentCardModel} from './models';

/**
 * Source export object structure.
 *
 * @exports
 * @interface SourceExport
 */
export interface SourceExport {
  getIp(): string;
  getBrowser(): string;
  getReferrer(): string;
}

/**
 * ValidatorExport object structure.
 *
 * @exports
 * @interface ValidatorExport
 */
export interface Validator {
  validateIdentifier(identifier: string): void;
  validateLocation(location: LocationModel): void;
  validateRoute(
    homeLocation: LocationModel,
    senderLocation: LocationModel,
    receiverLocation: LocationModel,
    maxDistance: number,
  ): number;
  validatePaymentCard(paymentCard: PaymentCardModel): void;
}

/**
 * Payment export object structure.
 *
 * @exports
 * @interface PaymentExport
 */
export interface PaymentExport {
  getId(): string;
  getOrderId(): string;
  getPaymentCardToken(): string;
  getCreatedOn(): number;
  getCompletedOn(): number | undefined;
  isCompleted(): boolean;
  markAsCompleted(): number;
}

/**
 * User export object structure.
 *
 * @export
 * @interface UserExport
 */
export interface UserExport {
  getId(): string;
  getToken(): string;
  getPhoneNumber(): string;
}
