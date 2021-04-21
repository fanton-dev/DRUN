import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final List properties = const <dynamic>[];

  @override
  List<Object> get props => [properties];

  String get message => 'Generic failure.';
}

// Generic failures
class ServerFailure extends Failure {
  @override
  String get message => 'Server failure.';
}

class NetworkFailure extends Failure {
  @override
  String get message => 'Network failure.';
}

class CacheFailure extends Failure {
  @override
  String get message => 'Cache failure.';
}

class InvalidInputFailure extends Failure {
  @override
  String get message =>
      'Invalid input - Make sure you inputted a valid phone number.';
}

class PermissionFailure extends Failure {
  @override
  String get message => 'Insufficient permissions.';
}

class ContactSelectionFailure extends Failure {
  @override
  String get message => 'Failure during contact selection.';
}

class PaymentCardFailure extends Failure {
  @override
  String get message => 'Invalid payment card information.';
}
