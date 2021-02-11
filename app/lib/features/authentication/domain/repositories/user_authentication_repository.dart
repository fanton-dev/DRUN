import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/authentication_sms_status.dart';
import '../entities/user_credentials.dart';

abstract class UserAuthenticationRepository {
  Future<Either<Failure, AuthenticationSmsStatus>> sendAuthenticationSms(
      String phoneNumber);

  Future<Either<Failure, UserCredentials>> verifyAuthenticationSms(
      String phoneNumber, String code);
}
