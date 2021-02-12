import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_credentials.dart';
import '../repositories/user_authentication_repository.dart';

class GetLoggedInUser extends UseCase<UserCredentials, NoParams> {
  final UserAuthenticationRepository repository;

  GetLoggedInUser(this.repository);

  @override
  Future<Either<Failure, UserCredentials>> call(NoParams params) async {
    return await repository.getLoggedInUser();
  }
}
