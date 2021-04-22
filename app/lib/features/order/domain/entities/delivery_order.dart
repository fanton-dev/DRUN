import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import 'location.dart';

class DeliveryOrder extends Equatable {
  final String senderUserId;
  final LocationCoordinates senderLocationCoordinates;
  final String receiverUserId;
  final LocationCoordinates receiverLocationCoordinates;
  final String paymentCardToken;

  DeliveryOrder({
    @required this.senderUserId,
    @required this.senderLocationCoordinates,
    @required this.receiverUserId,
    @required this.receiverLocationCoordinates,
    @required this.paymentCardToken,
  })  : assert(senderUserId != null),
        assert(senderLocationCoordinates != null),
        assert(receiverUserId != null),
        assert(receiverLocationCoordinates != null),
        assert(paymentCardToken != null);

  @override
  List<Object> get props => [
        senderUserId,
        receiverUserId,
        receiverUserId,
        receiverLocationCoordinates,
        paymentCardToken,
      ];
}
