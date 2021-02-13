import 'package:meta/meta.dart';

import '../../domain/entities/authentication_sms_status.dart';

class AuthenticationSmsStatusModel extends AuthenticationSmsStatus {
  AuthenticationSmsStatusModel({
    @required phoneNumber,
    @required succeeded,
  })  : assert(phoneNumber != null),
        assert(succeeded != null),
        super(phoneNumber: phoneNumber, succeeded: succeeded);

  factory AuthenticationSmsStatusModel.fromJSON(Map<String, dynamic> json) {
    return AuthenticationSmsStatusModel(
      phoneNumber: json['phoneNumber'],
      succeeded: json['succeeded'],
    );
  }
}
