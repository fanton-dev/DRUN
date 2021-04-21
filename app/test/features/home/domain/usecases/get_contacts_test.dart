import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/home/domain/entities/complete_contact.dart';
import 'package:DRUN/features/home/domain/entities/local_contact.dart';
import 'package:DRUN/features/home/domain/repositories/contacts_repository.dart';
import 'package:DRUN/features/home/domain/usecases/get_contacts.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockContactsRepository extends Mock implements ContactsRepository {}

void main() {
  GetContacts usecase;
  MockContactsRepository mockContactsRepository;

  setUp(() {
    mockContactsRepository = MockContactsRepository();
    usecase = GetContacts(repository: mockContactsRepository);
  });

  final tLocalContacts = <LocalContact>[
    LocalContact(name: 'Gosho Losho', phoneNumber: '+359735780085'),
    LocalContact(name: 'Posho Mosho', phoneNumber: '+359800857357'),
    LocalContact(name: 'Oshte Gosho', phoneNumber: '+359888888888'),
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

  test(
    'should get local phone contacts list from the repository',
    () async {
      // Arrange
      when(mockContactsRepository.getLocalContacts())
          .thenAnswer((_) async => Right(tLocalContacts));

      // Act
      await usecase(NoParams());

      // Assert
      verify(mockContactsRepository.getLocalContacts());
    },
  );

  test(
    'should get registered users from local contacts list from the repository',
    () async {
      // Arrange
      when(mockContactsRepository.getLocalContacts())
          .thenAnswer((_) async => Right(tLocalContacts));

      when(mockContactsRepository.getRegisteredUsersInLocalContacts(any))
          .thenAnswer((_) async => Right(tCompleteContacts));

      // Act
      final result = await usecase(NoParams());

      // Assert
      expect(result, Right(tCompleteContacts));
      verify(mockContactsRepository.getRegisteredUsersInLocalContacts(
        tLocalContacts,
      ));
    },
  );
}
