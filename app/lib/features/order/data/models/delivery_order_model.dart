import 'package:meta/meta.dart';

import '../../domain/entities/delivery_order.dart';
import '../../domain/entities/location.dart';
import 'location_model.dart';

class DeliveryOrderModel extends DeliveryOrder {
  final String senderUserId;
  final LocationCoordinates senderLocationCoordinates;
  final String receiverUserId;
  final LocationCoordinates receiverLocationCoordinates;
  final String paymentCardToken;

  DeliveryOrderModel({
    @required this.senderUserId,
    @required this.senderLocationCoordinates,
    @required this.receiverUserId,
    @required this.receiverLocationCoordinates,
    @required this.paymentCardToken,
  })  : assert(senderUserId != null),
        assert(senderLocationCoordinates != null),
        assert(receiverUserId != null),
        assert(receiverLocationCoordinates != null),
        assert(paymentCardToken != null),
        super(
          senderUserId: senderUserId,
          senderLocationCoordinates: senderLocationCoordinates,
          receiverUserId: receiverUserId,
          receiverLocationCoordinates: receiverLocationCoordinates,
          paymentCardToken: paymentCardToken,
        );

  Map<String, dynamic> toJSON() {
    return {
      'sender': {
        'id': this.senderUserId,
        'location': LocationCoordinatesModel.fromEntity(
          this.senderLocationCoordinates,
        ).toJSON(),
      },
      'receiver': {
        'id': this.receiverUserId,
        'location': LocationCoordinatesModel.fromEntity(
          this.receiverLocationCoordinates,
        ).toJSON(),
      },
      'paymentCardToken': this.paymentCardToken,
    };
  }
}
