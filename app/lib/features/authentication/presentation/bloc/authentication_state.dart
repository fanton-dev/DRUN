part of 'authentication_bloc.dart';

abstract class AuthenticationState extends Equatable {
  const AuthenticationState();

  @override
  List<Object> get props => [];
}

class AuthenticationInitialState extends AuthenticationState {}

class AuthenticationLoadingState extends AuthenticationState {}

class AuthenticationPhoneInputState extends AuthenticationState {}

class AuthenticationPhoneInputErrorState extends AuthenticationState {
  final String message;

  AuthenticationPhoneInputErrorState({@required this.message});
}

class AuthenticationCodeInputState extends AuthenticationState {
  final AuthenticationSmsStatus authenticationSmsStatus;

  AuthenticationCodeInputState({@required this.authenticationSmsStatus});
}

class AuthenticationCodeInputErrorState extends AuthenticationState {
  final String message;

  AuthenticationCodeInputErrorState({@required this.message});
}

class AuthenticationSuccessfulState extends AuthenticationState {
  final UserCredentials userCredentials;

  AuthenticationSuccessfulState({@required this.userCredentials});
}
