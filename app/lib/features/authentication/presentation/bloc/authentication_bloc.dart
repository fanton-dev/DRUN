import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../../../core/presentation/util/input_validator.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/authentication_sms_status.dart';
import '../../domain/entities/user_credentials.dart';
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
    if (event is GetLoggedInUserEvent) {
      yield AuthenticationLoadingState();
      // Getting cached user credentials
      // On failure -> nothing is changed
      // On success -> the AuthenticationSuccessfulState is generated
      final cacheEither = await getLoggedInUser(NoParams());
      yield* cacheEither.fold(
        (failure) async* {},
        (userCredentials) async* {
          yield AuthenticationSuccessfulState(userCredentials: userCredentials);
        },
      );
    }

    if (event is StartAuthenticationEvent) {
      yield AuthenticationPhoneInputState();
    }

    if (event is SendAuthenticationSmsEvent) {
      final inputEither = inputValidator.stringAsPhoneNumber(event.phoneNumber);
      // Validating user input
      // On failure -> the AuthenticationErrorState is generated
      // On success -> the AuthenticationLoadingState is generated while waiting
      //               for the sendAuthenticationSms usecase to complete.
      yield* inputEither.fold(
        (failure) async* {
          yield AuthenticationPhoneInputErrorState(message: failure.message);
        },
        (phoneNumber) async* {
          yield AuthenticationLoadingState();
          final responseEither = await sendAuthenticationSms(
            SendParams(phoneNumber: phoneNumber),
          );

          // Handling usecase response
          // On failure -> the AuthenticationErrorState is generated
          // On success -> the AuthenticationCodeInputState is generated
          yield* responseEither.fold(
            (failure) async* {
              yield AuthenticationPhoneInputErrorState(
                  message: failure.message);
            },
            (authenticationSmsStatus) async* {
              yield AuthenticationCodeInputState(
                authenticationSmsStatus: authenticationSmsStatus,
              );
            },
          );
        },
      );
    }

    if (event is VerifyAuthenticationSmsEvent) {
      yield AuthenticationLoadingState();
      final responseEither = await verifyAuthenticationSms(
        VerifyParams(phoneNumber: event.phoneNumber, code: event.code),
      );

      // Handling usecase response
      // On failure -> the AuthenticationErrorState is generated
      // On success -> the AuthenticationSuccessfulState is generated
      yield* responseEither.fold(
        (failure) async* {
          yield AuthenticationCodeInputErrorState(message: failure.message);
        },
        (userCredentials) async* {
          yield AuthenticationSuccessfulState(userCredentials: userCredentials);
        },
      );
    }
  }

  @override
  AuthenticationState get initialState => AuthenticationInitialState();
}
