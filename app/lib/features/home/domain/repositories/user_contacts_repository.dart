import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/user_contacts.dart';

abstract class UserContactsRepository {
  Future<Either<Failure, UserContacts>> getLocalContacts();

  Future<Either<Failure, UserContacts>> getRegisteredUsersInLocalContacts(
    UserContacts localContacts,
  );
}
