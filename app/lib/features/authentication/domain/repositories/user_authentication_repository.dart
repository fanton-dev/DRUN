import 'package:dartz/dartz.dart';

import '../../../../core/errors/failure.dart';
import '../entities/authentication_sms_status.dart';
import '../entities/user_credentials.dart';

abstract class UserAuthenticationRepository {
  Future<Either<Failure, AuthenticationSmsStatus>> sendAuthenticationSms(
      String phoneNumber);

  Future<Either<Failure, UserCredential>> verifyAuthenticationSms(
      String phoneNumber, String code);
}
