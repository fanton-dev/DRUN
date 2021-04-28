part of 'order_bloc.dart';

abstract class OrderState extends Equatable {
  const OrderState();

  @override
  List<Object> get props => [];
}

class OrderInitialState extends OrderState {}

class OrderLocationSelectState extends OrderState {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;
  final LocationCoordinates locationCoordinates;

  OrderLocationSelectState({
    @required this.userCredentials,
    @required this.selectedContact,
    @required this.locationCoordinates,
  });
}

class OrderFailureState extends OrderState {
  final String message;

  OrderFailureState({@required this.message});
}

class OrderPaymentCardInputState extends OrderState {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;
  final LocationCoordinates senderLocationCoordinates;
  final LocationCoordinates receiverLocationCoordinates;

  OrderPaymentCardInputState({
    @required this.userCredentials,
    @required this.selectedContact,
    @required this.senderLocationCoordinates,
    @required this.receiverLocationCoordinates,
  });
}

class OrderSubmittedState extends OrderState {}
