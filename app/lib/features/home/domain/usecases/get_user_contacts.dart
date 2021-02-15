import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user_contacts.dart';
import '../repositories/user_contacts_repository.dart';

class GetUserContacts extends UseCase<UserContacts, NoParams> {
  final UserContactsRepository repository;

  GetUserContacts({@required this.repository}) : assert(repository != null);

  @override
  Future<Either<Failure, UserContacts>> call(NoParams params) async {
    final localContacts = await repository.getLocalContacts();
    return localContacts.fold(
      (failure) => Left(failure),
      (localContacts) async =>
          await repository.getRegisteredUsersInLocalContacts(localContacts),
    );
  }
}
