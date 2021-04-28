part of 'order_bloc.dart';

abstract class OrderEvent extends Equatable {
  const OrderEvent();

  @override
  List<Object> get props => [];
}

class GetSelectedUserEvent extends OrderEvent {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;

  GetSelectedUserEvent({
    @required this.userCredentials,
    @required this.selectedContact,
  });
}

class GetPaymentCardEvent extends OrderEvent {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;
  final LocationCoordinates senderLocationCoordinates;
  final LocationCoordinates receiverLocationCoordinates;

  GetPaymentCardEvent({
    @required this.userCredentials,
    @required this.selectedContact,
    @required this.senderLocationCoordinates,
    @required this.receiverLocationCoordinates,
  });
}

class MakeDeliveryOrderEvent extends OrderEvent {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;
  final LocationCoordinates senderLocationCoordinates;
  final LocationCoordinates receiverLocationCoordinates;
  final String paymentCardToken;

  MakeDeliveryOrderEvent({
    @required this.userCredentials,
    @required this.selectedContact,
    @required this.senderLocationCoordinates,
    @required this.receiverLocationCoordinates,
    @required this.paymentCardToken,
  });
}
