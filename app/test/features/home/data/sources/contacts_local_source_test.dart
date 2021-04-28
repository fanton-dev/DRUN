import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/home/data/models/local_contact_model.dart';
import 'package:DRUN/features/home/data/sources/contacts_local_source.dart';
import 'package:contacts_service/contacts_service.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockPermissionHandler extends Mock implements PermissionHandler {}

class MockGetContacts extends Mock {
  Future<Iterable<Contact>> call();
}

void main() {
  ContactsLocalSourceImpl dataSource;
  PermissionHandler mockPermissionHandler;
  Future<Iterable<Contact>> Function() mockGetContacts;

  setUp(() {
    mockPermissionHandler = MockPermissionHandler();
    mockGetContacts = MockGetContacts();
    dataSource = ContactsLocalSourceImpl(
      permissionHandler: mockPermissionHandler,
      getContacts: mockGetContacts,
    );
  });

  final tLocalContactsRaw = <Contact>[
    Contact(
      displayName: 'Gosho Losho',
      phones: [Item(label: 'mobile', value: '+359735780085')],
    ),
    Contact(
      displayName: 'Posho Mosho',
      phones: [Item(label: 'mobile', value: '+359800857357')],
    ),
    Contact(
      displayName: 'Oshte Gosho',
      phones: [Item(label: 'mobile', value: '+359888888888')],
    ),
  ];

  final tLocalContacts = <LocalContactModel>[
    LocalContactModel(name: 'Gosho Losho', phoneNumber: '+359735780085'),
    LocalContactModel(name: 'Posho Mosho', phoneNumber: '+359800857357'),
    LocalContactModel(name: 'Oshte Gosho', phoneNumber: '+359888888888'),
  ];

  group('getLocalContactsFromAddressBook', () {
    test(
      'should return local contacts list when permissions are granted',
      () async {
        // Arrange
        when(
          mockPermissionHandler.checkPermissionStatus(any),
        ).thenAnswer((_) async => PermissionStatus.granted);
        when(mockGetContacts()).thenAnswer((_) async => tLocalContactsRaw);

        // Act
        final result = await dataSource.getLocalContactsFromAddressBook();

        // Assert
        expect(result, tLocalContacts);
      },
    );

    test(
      'should throw a PermissionException when permissions are denied',
      () async {
        // Arrange
        when(
          mockPermissionHandler.checkPermissionStatus(any),
        ).thenAnswer((_) async => PermissionStatus.denied);

        // Act
        final call = dataSource.getLocalContactsFromAddressBook;

        // Assert
        expect(() async => call(), throwsA(isA<PermissionException>()));
      },
    );
  });
}
