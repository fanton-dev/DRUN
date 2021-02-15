import 'dart:convert';

import 'package:DRUN/features/home/data/models/registered_contact_model.dart';
import 'package:DRUN/features/home/domain/entities/registered_contact.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../fixtures/fixture_parser.dart';

void main() {
  final tRegisteredContactModel1 = RegisteredContactModel(
    phoneNumber: '+359735780085',
    userId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
  );

  final tRegisteredContactModel2 = RegisteredContactModel(
    phoneNumber: '+359888888888',
    userId: '2cc9754b-2520-4dad-be5f-2da3e3341800',
  );

  test(
    'should be an extension of RegisteredContactModel entity',
    () async {
      // Assert
      expect(tRegisteredContactModel1, isA<RegisteredContact>());
    },
  );

  test(
    'should parse form JSON',
    () async {
      // Arrange
      final Map<String, dynamic> jsonMap =
          json.decode(fixture('registered_contacts.json'));

      // Act
      final result1 = RegisteredContactModel.fromJSON(jsonMap[0]);
      final result2 = RegisteredContactModel.fromJSON(jsonMap[1]);

      // Assert
      expect(result1, tRegisteredContactModel1);
      expect(result2, tRegisteredContactModel2);
    },
  );
}
