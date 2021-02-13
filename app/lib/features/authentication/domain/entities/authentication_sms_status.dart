import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class AuthenticationSmsStatus extends Equatable {
  final String phoneNumber;
  final bool succeeded;

  AuthenticationSmsStatus({
    @required this.phoneNumber,
    @required this.succeeded,
  })  : assert(phoneNumber != null),
        assert(phoneNumber != null);

  @override
  List<Object> get props => [phoneNumber, succeeded];
}
