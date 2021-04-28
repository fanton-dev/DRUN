import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/complete_contact.dart';
import '../entities/local_contact.dart';

abstract class ContactsRepository {
  Future<Either<Failure, List<LocalContact>>> getLocalContacts();

  Future<Either<Failure, List<CompleteContact>>>
      getRegisteredUsersInLocalContacts(List<LocalContact> localContacts);
}
