import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import 'location.dart';

class DeliveryOrder extends Equatable {
  final String senderUserId;
  final Location senderLocation;
  final String receiverUserId;
  final Location receiverLocation;
  final String paymentCardToken;

  DeliveryOrder({
    @required this.senderUserId,
    @required this.senderLocation,
    @required this.receiverUserId,
    @required this.receiverLocation,
    @required this.paymentCardToken,
  })  : assert(senderUserId != null),
        assert(senderLocation != null),
        assert(receiverUserId != null),
        assert(receiverLocation != null),
        assert(paymentCardToken != null);

  @override
  List<Object> get props => [
        senderUserId,
        receiverUserId,
        receiverUserId,
        receiverLocation,
        paymentCardToken,
      ];
}
