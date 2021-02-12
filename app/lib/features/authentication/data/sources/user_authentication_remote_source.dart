import '../models/authentication_sms_status_model.dart';
import '../models/user_credentials_model.dart';

abstract class UserAuthenticationRemoteSource {
  /// POST to https://drun.rocks/api/users/authenticate/send-sms-code endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<AuthenticationSmsStatusModel> sendAuthenticationSms(
    String phoneNumber,
  );

  /// POST to https://drun.rocks/api/users/authenticate/verify-sms-code endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<UserCredentialsModel> verifyAuthenticationSms(
    String phoneNumber,
    String code,
  );
}
