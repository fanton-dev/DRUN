import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_credentials.dart';
import '../repositories/user_authentication_repository.dart';

class VerifyAuthenticationSms extends UseCase<UserCredentials, VerifyParams> {
  final UserAuthenticationRepository repository;

  VerifyAuthenticationSms(this.repository);

  @override
  Future<Either<Failure, UserCredentials>> call(VerifyParams params) async {
    return await repository.verifyAuthenticationSms(
        params.phoneNumber, params.code);
  }
}

class VerifyParams extends Equatable {
  final String phoneNumber;
  final String code;

  VerifyParams({
    @required this.phoneNumber,
    @required this.code,
  })  : assert(phoneNumber != null),
        assert(code != null);

  @override
  List<Object> get props => [phoneNumber, code];
}
