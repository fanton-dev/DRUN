import '../models/delivery_order_model.dart';

abstract class OrdersRemoteSource {
  /// POST to https://$SERVER_ADDRESS/api/orders endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<String> makeDeliveryOrder(DeliveryOrderModel deliveryOrderModel);

  /// Calls the Stripe API to generate a payment
  ///
  /// Throws a [PaymentCardException] for all errors that occur.
  Future<String> getPaymentCardToken();
}
