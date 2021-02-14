part of 'authentication_bloc.dart';

abstract class AuthenticationEvent extends Equatable {
  const AuthenticationEvent();

  @override
  List<Object> get props => [];
}

class GetLoggedInUserEvent extends AuthenticationEvent {
  GetLoggedInUserEvent();
}

class StartAuthenticationEvent extends AuthenticationEvent {
  StartAuthenticationEvent();
}

class SendAuthenticationSmsEvent extends AuthenticationEvent {
  final String phoneNumber;

  SendAuthenticationSmsEvent(this.phoneNumber);
}

class VerifyAuthenticationSmsEvent extends AuthenticationEvent {
  final String phoneNumber;
  final String code;

  VerifyAuthenticationSmsEvent(this.phoneNumber, this.code);
}
