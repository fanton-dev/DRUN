import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class AuthenticationSmsStatus extends Equatable {
  final bool succeeded;
  final String phoneNumber;

  AuthenticationSmsStatus(
      {@required this.succeeded, @required this.phoneNumber});

  @override
  List<Object> get props => [succeeded, phoneNumber];
}
