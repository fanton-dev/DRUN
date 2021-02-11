import 'dart:convert';

import 'package:DRUN/features/authentication/data/models/user_credentials_model.dart';
import 'package:DRUN/features/authentication/domain/entities/user_credentials.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../fixtures/fixture_parser.dart';

void main() {
  final tUserCredentialsModelSuccess = UserCredentialsModel(
    userId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
    userToken: '713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5',
  );

  test(
    'should be an extension of AuthenticationSmsStatus entity',
    () async {
      // Assert
      expect(
        tUserCredentialsModelSuccess,
        isA<UserCredentials>(),
      );
    },
  );

  test(
    'should parse from JSON',
    () async {
      // Arrange
      final Map<String, dynamic> jsonMap =
          json.decode(fixture('user_credentials_success.json'));

      // Act
      final result = UserCredentialsModel.fromJSON(jsonMap);

      // Assert
      expect(result, tUserCredentialsModelSuccess);
    },
  );
}
