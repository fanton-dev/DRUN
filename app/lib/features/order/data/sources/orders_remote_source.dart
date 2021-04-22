import 'package:DRUN/core/errors/exceptions.dart';
import 'package:stripe_payment/stripe_payment.dart';

import '../models/delivery_order_model.dart';
import 'package:meta/meta.dart';

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

class OrdersRemoteSourceImpl implements OrdersRemoteSource {
  final Future<PaymentMethod> Function() paymentRequestWithCardForm;

  OrdersRemoteSourceImpl({
    @required this.paymentRequestWithCardForm,
  });

  @override
  Future<String> getPaymentCardToken() async {
    try {
      final paymentMethod = await paymentRequestWithCardForm();
      return paymentMethod.id;
    } catch (e) {
      throw PaymentCardException();
    }
  }

  @override
  Future<String> makeDeliveryOrder(DeliveryOrderModel deliveryOrderModel) {
    // TODO: implement makeDeliveryOrder
    throw UnimplementedError();
  }
}
