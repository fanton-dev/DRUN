import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:meta/meta.dart';

import '../../domain/entities/delivery_order.dart';
import 'location_model.dart';

class DeliveryOrderModel extends DeliveryOrder {
  final String senderUserId;
  final Location senderLocation;
  final String receiverUserId;
  final Location receiverLocation;
  final String paymentCardToken;

  DeliveryOrderModel({
    @required this.senderUserId,
    @required this.senderLocation,
    @required this.receiverUserId,
    @required this.receiverLocation,
    @required this.paymentCardToken,
  })  : assert(senderUserId != null),
        assert(senderLocation != null),
        assert(receiverUserId != null),
        assert(receiverLocation != null),
        assert(paymentCardToken != null),
        super(
          senderUserId: senderUserId,
          senderLocation: senderLocation,
          receiverUserId: receiverUserId,
          receiverLocation: receiverLocation,
          paymentCardToken: paymentCardToken,
        );

  Map<String, dynamic> toJSON() {
    return {
      'sender': {
        'id': this.senderUserId,
        'location': LocationModel.fromEntity(this.senderLocation).toJSON(),
      },
      'receiver': {
        'id': this.receiverUserId,
        'location': LocationModel.fromEntity(this.receiverLocation).toJSON(),
      },
      'paymentCardToken': this.paymentCardToken,
    };
  }
}
