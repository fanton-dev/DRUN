import 'dart:async';

import 'package:DRUN/core/presentation/util/input_validator.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../domain/entities/authentication_sms_status.dart';
import '../../domain/usecases/get_logged_in_user.dart';
import '../../domain/usecases/send_authentication_sms.dart';
import '../../domain/usecases/verify_authentication_sms.dart';

part 'authentication_event.dart';
part 'authentication_state.dart';

class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  final GetLoggedInUser getLoggedInUser;
  final SendAuthenticationSms sendAuthenticationSms;
  final VerifyAuthenticationSms verifyAuthenticationSms;
  final InputValidator inputValidator;

  AuthenticationBloc({
    @required this.getLoggedInUser,
    @required this.sendAuthenticationSms,
    @required this.verifyAuthenticationSms,
    @required this.inputValidator,
  })  : assert(getLoggedInUser != null),
        assert(sendAuthenticationSms != null),
        assert(verifyAuthenticationSms != null),
        assert(inputValidator != null);

  @override
  Stream<AuthenticationState> mapEventToState(
    AuthenticationEvent event,
  ) async* {
    if (event is SendAuthenticationSmsEvent) {
      final inputEither = inputValidator.stringAsPhoneNumber(event.phoneNumber);
      // Validating user input
      // On failure -> the AuthenticationErrorState is generated
      // On success -> the AuthenticationLoadingState is generated while waiting
      //               for the sendAuthenticationSms usecase to complete.
      yield* inputEither.fold(
        (failure) async* {
          yield AuthenticationErrorState(message: failure.message);
        },
        (phoneNumber) async* {
          yield AuthenticationLoadingState();
          final responseEither = await sendAuthenticationSms(
            SendParams(phoneNumber: phoneNumber),
          );

          // Handling usecase response
          // On failure -> the AuthenticationErrorState is generated
          // On success -> the AuthenticationCodeInputState is generated
          yield* responseEither.fold((failure) async* {
            yield AuthenticationErrorState(message: failure.message);
          }, (authenticationSmsStatus) async* {
            yield AuthenticationCodeInputState(
              authenticationSmsStatus: authenticationSmsStatus,
            );
          });
        },
      );
    }
  }

  @override
  AuthenticationState get initialState => AuthenticationInitialState();
}
