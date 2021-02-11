import 'dart:convert';

import 'package:DRUN/features/authentication/data/models/authentication_sms_status_model.dart';
import 'package:DRUN/features/authentication/domain/entities/authentication_sms_status.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../fixtures/fixture_parser.dart';

void main() {
  final tAuthenticationSmsStatusModelSuccess = AuthenticationSmsStatusModel(
    phoneNumber: '+359735780085',
    succeeded: true,
  );

  test(
    'should be an extension of AuthenticationSmsStatus entity',
    () async {
      // Assert
      expect(
          tAuthenticationSmsStatusModelSuccess, isA<AuthenticationSmsStatus>());
    },
  );

  test(
    'should parse from JSON',
    () async {
      // Arrange
      final Map<String, dynamic> jsonMap =
          json.decode(fixture('authentication_sms_status_success.json'));

      // Act
      final result = AuthenticationSmsStatusModel.fromJSON(jsonMap);

      // Assert
      expect(result, tAuthenticationSmsStatusModelSuccess);
    },
  );
}
