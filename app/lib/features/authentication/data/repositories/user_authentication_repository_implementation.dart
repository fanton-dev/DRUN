import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../../../core/data/sources/network_info.dart';
import '../../domain/entities/authentication_sms_status.dart';
import '../../domain/entities/user_credentials.dart';
import '../../domain/repositories/user_authentication_repository.dart';
import '../sources/user_authentication_local_source.dart';
import '../sources/user_authentication_remote_source.dart';

class UserAuthenticationRepositoryImplementation
    implements UserAuthenticationRepository {
  final UserAuthenticationRemoteSource remoteSource;
  final UserAuthenticationLocalSource localSource;
  final NetworkInfo networkInfo;

  UserAuthenticationRepositoryImplementation({
    @required this.remoteSource,
    @required this.localSource,
    @required this.networkInfo,
  })  : assert(remoteSource != null),
        assert(localSource != null),
        assert(networkInfo != null);

  @override
  Future<Either<Failure, AuthenticationSmsStatus>> sendAuthenticationSms(
    String phoneNumber,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final authenticationSmsStatus =
            await remoteSource.sendAuthenticationSms(phoneNumber);
        return Right(authenticationSmsStatus);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, UserCredentials>> verifyAuthenticationSms(
    String phoneNumber,
    String code,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final userCredentials = await remoteSource.verifyAuthenticationSms(
          phoneNumber,
          code,
        );
        localSource.cacheUserCredentials(userCredentials);
        return Right(userCredentials);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, UserCredentials>> getLoggedInUser() async {
    try {
      final userCredentials = await localSource.getUserCredentials();
      return Right(userCredentials);
    } on CacheException {
      return Left(CacheFailure());
    }
  }
}
