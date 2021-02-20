part of 'authentication_bloc.dart';

abstract class AuthenticationState extends Equatable {
  const AuthenticationState();

  @override
  List<Object> get props => [];
}

class AuthenticationInitialState extends AuthenticationState {}

class AuthenticationLoadingState extends AuthenticationState {}

class AuthenticationErrorState extends AuthenticationState {
  final String message;

  AuthenticationErrorState({@required this.message});
}

class AuthenticationPhoneInputState extends AuthenticationState {}

class AuthenticationCodeInputState extends AuthenticationState {
  final AuthenticationSmsStatus authenticationSmsStatus;

  AuthenticationCodeInputState({@required this.authenticationSmsStatus});
}

class AuthenticationSuccessfulState extends AuthenticationState {
  final UserCredentials userCredentials;

  AuthenticationSuccessfulState({@required this.userCredentials});
}
