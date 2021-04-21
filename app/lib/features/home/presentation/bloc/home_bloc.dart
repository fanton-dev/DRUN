import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../authentication/domain/entities/user_credentials.dart';
import '../../domain/entities/complete_contact.dart';
import '../../domain/usecases/get_contacts.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final GetContacts getContacts;

  HomeBloc({
    @required this.getContacts,
  }) : assert(getContacts != null);

  @override
  Stream<HomeState> mapEventToState(
    HomeEvent event,
  ) async* {
    if (event is GetContactsEvent) {
      final contactsEither = await this.getContacts(NoParams());
      yield* contactsEither.fold(
        (failure) async* {
          yield HomeFailureState(message: failure.message);
        },
        (contacts) async* {
          yield HomeAuthenticatedState(
            userCredentials: event.userCredentials,
            contacts: contacts,
          );
        },
      );
    }

    if (event is HomeContactSelectedEvent) {
      try {
        CompleteContact selectedContact = event.contacts
            .where(
              (element) => element.userId == event.selectedUserId,
            )
            .first;

        yield HomeContactSelectedState(
          userCredentials: event.userCredentials,
          selectedContact: selectedContact,
        );
      } on StateError {
        yield HomeFailureState(message: ContactSelectionFailure().message);
      }
    }
  }

  @override
  HomeState get initialState => HomeInitialState();
}
