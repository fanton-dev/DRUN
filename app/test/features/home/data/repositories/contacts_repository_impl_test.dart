import 'package:DRUN/core/data/sources/network_info.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/features/home/data/models/local_contact_model.dart';
import 'package:DRUN/features/home/data/models/registered_contact_model.dart';
import 'package:DRUN/features/home/data/repository/contacts_repository_impl.dart';
import 'package:DRUN/features/home/data/sources/contacts_local_source.dart';
import 'package:DRUN/features/home/data/sources/contacts_remote_source.dart';
import 'package:DRUN/features/home/domain/entities/complete_contact.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockContactsRemoteSource extends Mock implements ContactsRemoteSource {}

class MockContactsLocalSource extends Mock implements ContactsLocalSource {}

class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  ContactsRepositoryImpl repository;
  MockContactsRemoteSource mockContactsRemoteSource;
  MockContactsLocalSource mockContactsLocalSource;
  MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockContactsRemoteSource = MockContactsRemoteSource();
    mockContactsLocalSource = MockContactsLocalSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = ContactsRepositoryImpl(
      remoteSource: mockContactsRemoteSource,
      localSource: mockContactsLocalSource,
      networkInfo: mockNetworkInfo,
    );
  });

  final tLocalContacts = <LocalContactModel>[
    LocalContactModel(name: 'Gosho Losho', phoneNumber: '+359735780085'),
    LocalContactModel(name: 'Posho Mosho', phoneNumber: '+359800857357'),
    LocalContactModel(name: 'Oshte Gosho', phoneNumber: '+359888888888'),
  ];

  final tRegisteredContacts = <RegisteredContactModel>[
    RegisteredContactModel(
      phoneNumber: '+359735780085',
      userId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
    ),
    RegisteredContactModel(
      phoneNumber: '+359888888888',
      userId: '2cc9754b-2520-4dad-be5f-2da3e3341800',
    ),
  ];

  final tCompleteContacts = <CompleteContact>[
    CompleteContact(
      name: 'Gosho Losho',
      phoneNumber: '+359735780085',
      userId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
    ),
    CompleteContact(
      name: 'Oshte Gosho',
      phoneNumber: '+359888888888',
      userId: '2cc9754b-2520-4dad-be5f-2da3e3341800',
    ),
  ];

  group('getLocalContacts', () {
    test(
      'should return contacts loaded from the local phone address book',
      () async {
        // Arrange
        when(mockContactsLocalSource.getLocalContactsFromAddressBook())
            .thenAnswer((_) async => tLocalContacts);

        // Act
        final result = await repository.getLocalContacts();

        // Assert
        verify(mockContactsLocalSource.getLocalContactsFromAddressBook());
        verifyZeroInteractions(mockContactsRemoteSource);
        expect(result, Right(tLocalContacts));
      },
    );

    test(
      'should return permission failure when local contacts cannot be loaded',
      () async {
        // Arrange
        when(mockContactsLocalSource.getLocalContactsFromAddressBook())
            .thenThrow(PermissionException());

        // Act
        final result = await repository.getLocalContacts();

        // Assert
        verify(mockContactsLocalSource.getLocalContactsFromAddressBook());
        verifyZeroInteractions(mockContactsRemoteSource);
        expect(result, Left(PermissionFailure()));
      },
    );
  });

  group('getRegisteredUsersInLocalContacts', () {
    test(
      'should check if device is online',
      () async {
        // Arrange
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);
        when(
          mockContactsRemoteSource.getRegisteredUsersFromPhonesNumbers(any),
        ).thenAnswer((_) async => tRegisteredContacts);

        // Act
        repository.getRegisteredUsersInLocalContacts(tLocalContacts);

        // Assert
        verify(mockNetworkInfo.isConnected);
      },
    );

    group('device is online', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      });

      test(
        'should get data from remote source',
        () async {
          // Arrange
          when(
            mockContactsRemoteSource.getRegisteredUsersFromPhonesNumbers(any),
          ).thenAnswer((_) async => tRegisteredContacts);

          // Act
          await repository.getRegisteredUsersInLocalContacts(tLocalContacts);

          // Assert
          verify(
            mockContactsRemoteSource.getRegisteredUsersFromPhonesNumbers(any),
          );
        },
      );

      test(
        'should return server failure when the call to remote data source is unsuccessful',
        () async {
          // Arrange
          when(
            mockContactsRemoteSource.getRegisteredUsersFromPhonesNumbers(any),
          ).thenThrow(ServerException());

          // Act
          final result = await repository.getRegisteredUsersInLocalContacts(
            tLocalContacts,
          );

          // Assert
          expect(result, Left(ServerFailure()));
        },
      );

      test(
        'should return a list of CompleteContact entities of only registered contacts',
        () async {
          // Arrange
          when(
            mockContactsRemoteSource.getRegisteredUsersFromPhonesNumbers(any),
          ).thenAnswer((_) async => tRegisteredContacts);

          // Act
          final result = await repository.getRegisteredUsersInLocalContacts(
            tLocalContacts,
          );

          // Assert
          result.fold(
            (l) => expect(l, null),
            (r) => {
              for (var i = 0; i < tCompleteContacts.length; i++)
                {expect(r[0], tCompleteContacts[0])}
            },
          );
        },
      );
    });

    group('device is offline', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      });

      test(
        'should return network failure when there is no internet connection',
        () async {
          // Act
          final result = await repository
              .getRegisteredUsersInLocalContacts(tLocalContacts);

          // Assert
          verifyZeroInteractions(mockContactsLocalSource);
          verifyZeroInteractions(mockContactsRemoteSource);
          expect(result, Left(NetworkFailure()));
        },
      );
    });
  });
}
