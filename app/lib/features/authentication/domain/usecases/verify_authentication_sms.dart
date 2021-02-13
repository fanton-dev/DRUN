import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_credentials.dart';
import '../repositories/user_authentication_repository.dart';

class VerifyAuthenticationSms extends UseCase<UserCredentials, Params> {
  final UserAuthenticationRepository repository;

  VerifyAuthenticationSms(this.repository);

  @override
  Future<Either<Failure, UserCredentials>> call(Params params) async {
    return await repository.verifyAuthenticationSms(
        params.phoneNumber, params.code);
  }
}

class Params extends Equatable {
  final String phoneNumber;
  final String code;

  Params({
    @required this.phoneNumber,
    @required this.code,
  });

  @override
  List<Object> get props => [phoneNumber, code];
}
