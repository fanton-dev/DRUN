import { LocationModel, PaymentCardModel } from "./models";

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
    validateLocation(location: Location): void;
    validateRoute(
      homeLocation: LocationModel,
      senderLocation: LocationModel,
      receiverLocation: LocationModel,
      maxDistance: number,
    ): number;
    validatePaymentCard(paymentCard: PaymentCardModel): void;
  }
  