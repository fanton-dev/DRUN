import 'package:DRUN/features/home/data/models/local_contact_model.dart';
import 'package:DRUN/features/home/domain/entities/local_contact.dart';
import 'package:contacts_service/contacts_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final tLocalContactModel = LocalContactModel(
    name: 'Gosho Losho',
    phoneNumber: '+359735780085',
  );

  test(
    'should be an extension of LocalContactModel entity',
    () async {
      // Assert
      expect(tLocalContactModel, isA<LocalContact>());
    },
  );

  test(
    'should parse from ContactService',
    () async {
      // Arrange
      final contact = Contact(
        displayName: 'Gosho Losho',
        phones: [Item(label: 'mobile', value: '+359735780085')],
      );

      // Act
      final result = LocalContactModel.fromContactsService(contact);

      // Assert
      expect(result, tLocalContactModel);
    },
  );
}
