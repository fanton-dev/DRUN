import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/complete_contact.dart';
import '../repositories/contacts_repository.dart';

class GetContacts extends UseCase<List<CompleteContact>, NoParams> {
  final ContactsRepository repository;

  GetContacts({@required this.repository}) : assert(repository != null);

  @override
  Future<Either<Failure, List<CompleteContact>>> call(NoParams params) async {
    final localContacts = await repository.getLocalContacts();
    return localContacts.fold(
      (failure) => Left(failure),
      (localContacts) async =>
          await repository.getRegisteredUsersInLocalContacts(localContacts),
    );
  }
}
