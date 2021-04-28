import 'dart:async';

import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../../authentication/domain/entities/user_credentials.dart';
import '../../../home/domain/entities/complete_contact.dart';
import '../../domain/usecases/get_current_location_coordinates.dart';
import '../../domain/usecases/get_payment_card_token.dart';

part 'order_event.dart';
part 'order_state.dart';

class OrderBloc extends Bloc<OrderEvent, OrderState> {
  final GetCurrentLocationCoordinates getCurrentLocationCoordinates;
  final GetPaymentCardToken getPaymentCardToken;

  OrderBloc({
    @required this.getCurrentLocationCoordinates,
    @required this.getPaymentCardToken,
  })  : assert(getCurrentLocationCoordinates != null),
        assert(getPaymentCardToken != null);

  @override
  Stream<OrderState> mapEventToState(
    OrderEvent event,
  ) async* {
    if (event is GetSelectedUserEvent) {
      final locationEither =
          await this.getCurrentLocationCoordinates(NoParams());
      yield* locationEither.fold(
        (failure) async* {
          yield OrderFailureState(message: failure.message);
        },
        (location) async* {
          yield OrderLocationSelectState(
            userCredentials: event.userCredentials,
            selectedContact: event.selectedContact,
            locationCoordinates: location,
          );
        },
      );
    }

    if (event is GetPaymentCardEvent) {
      final locationEither = await this.getPaymentCardToken(NoParams());

      yield* locationEither.fold(
        (failure) async* {
          yield OrderFailureState(message: failure.message);
        },
        (location) async* {
          yield OrderPaymentCardInputState(
            userCredentials: event.userCredentials,
            selectedContact: event.selectedContact,
            senderLocationCoordinates: event.senderLocationCoordinates,
            receiverLocationCoordinates: event.receiverLocationCoordinates,
          );
        },
      );
    }

    if (event is MakeDeliveryOrderEvent) {}
  }

  @override
  OrderState get initialState => OrderInitialState();
}
