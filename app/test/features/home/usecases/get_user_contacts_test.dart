import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/home/domain/entities/user_contacts.dart';
import 'package:DRUN/features/home/domain/repositories/user_contacts_repository.dart';
import 'package:DRUN/features/home/domain/usecases/get_user_contacts.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockUserContactsRepository extends Mock
    implements UserContactsRepository {}

void main() {
  GetUserContacts usecase;
  MockUserContactsRepository mockUserContactsRepository;

  setUp(() {
    mockUserContactsRepository = MockUserContactsRepository();
    usecase = GetUserContacts(repository: mockUserContactsRepository);
  });

  final tLocalContacts = UserContacts(userContacts: [
    LocalUserContact(name: 'Gosho Losho', phoneNumber: '+359735780085'),
    LocalUserContact(name: 'Posho Mosho', phoneNumber: '+359800857357'),
    LocalUserContact(name: 'Oshte Gosho', phoneNumber: '+359888888888'),
  ]);

  final tRegisteredContact = UserContacts(userContacts: [
    RegisteredUserContact(phoneNumber: '+359735780085', userId: 'cde7-fd-449e'),
    RegisteredUserContact(phoneNumber: '+359888888888', userId: 'cddb-14-4e3f'),
  ]);

  test(
    'should get local phone contacts list from the repository',
    () async {
      // Arrange
      when(mockUserContactsRepository.getLocalContacts())
          .thenAnswer((_) async => Right(tLocalContacts));

      // Act
      await usecase(NoParams());

      // Assert
      verify(mockUserContactsRepository.getLocalContacts());
    },
  );

  test(
    'should get registered users from local contacts list from the repository',
    () async {
      // Arrange
      when(mockUserContactsRepository.getLocalContacts())
          .thenAnswer((_) async => Right(tLocalContacts));

      when(mockUserContactsRepository.getRegisteredUsersInLocalContacts(any))
          .thenAnswer((_) async => Right(tRegisteredContact));

      // Act
      final result = await usecase(NoParams());

      // Assert
      expect(result, Right(tRegisteredContact));
      verify(mockUserContactsRepository.getRegisteredUsersInLocalContacts(
        tLocalContacts,
      ));
    },
  );
}
