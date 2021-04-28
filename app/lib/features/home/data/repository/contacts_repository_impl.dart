import 'package:DRUN/core/data/sources/network_info.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/home/data/sources/contacts_local_source.dart';
import 'package:DRUN/features/home/data/sources/contacts_remote_source.dart';
import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../domain/entities/complete_contact.dart';
import '../../domain/entities/local_contact.dart';
import '../../domain/repositories/contacts_repository.dart';

class ContactsRepositoryImpl implements ContactsRepository {
  final ContactsRemoteSource remoteSource;
  final ContactsLocalSource localSource;
  final NetworkInfo networkInfo;

  ContactsRepositoryImpl({
    @required this.remoteSource,
    @required this.localSource,
    @required this.networkInfo,
  })  : assert(remoteSource != null),
        assert(localSource != null),
        assert(networkInfo != null);

  @override
  Future<Either<Failure, List<LocalContact>>> getLocalContacts() async {
    try {
      final localContacts = await localSource.getLocalContactsFromAddressBook();
      return Right(localContacts);
    } on PermissionException {
      return Left(PermissionFailure());
    }
  }

  @override
  Future<Either<Failure, List<CompleteContact>>>
      getRegisteredUsersInLocalContacts(
    List<LocalContact> localContacts,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final phoneNumbers = localContacts.map((e) => e.phoneNumber).toList();
        final remoteContacts = await remoteSource
            .getRegisteredUsersFromPhonesNumbers(phoneNumbers);
        remoteContacts.sort((a, b) => a.phoneNumber.compareTo(b.phoneNumber));

        // Creating CompleteContact entities combining both local and remote data
        final completeContacts = remoteContacts
            .map(
              (remoteC) => CompleteContact(
                name: localContacts
                    .where(
                      (localC) => localC.phoneNumber == remoteC.phoneNumber,
                    )
                    .first
                    .name,
                phoneNumber: remoteC.phoneNumber,
                userId: remoteC.userId,
              ),
            )
            .toList();

        return Right(completeContacts);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
