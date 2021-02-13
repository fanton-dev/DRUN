import 'dart:convert';

import 'package:DRUN/core/constants/constants.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/authentication/data/models/user_credentials_model.dart';
import 'package:DRUN/features/authentication/data/sources/user_authentication_local_source.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../fixtures/fixture_parser.dart';

class MockSharedPreferences extends Mock implements SharedPreferences {}

void main() {
  UserAuthenticationLocalSourceImpl dataSource;
  MockSharedPreferences mockSharedPreferences;

  setUp(() {
    mockSharedPreferences = MockSharedPreferences();
    dataSource = UserAuthenticationLocalSourceImpl(
      sharedPreferences: mockSharedPreferences,
    );
  });

  group('getUserCredentials', () {
    final tUserCredentialsModelSuccess = UserCredentialsModel.fromJSON(
      json.decode(fixture('user_credentials_success.json')),
    );

    test(
      'should return UserCredentialsModel from SharedPreferences when there is one cached',
      () async {
        // Arrange
        when(mockSharedPreferences.getString(any))
            .thenReturn(fixture('user_credentials_success.json'));

        // Act
        final result = await dataSource.getUserCredentials();

        // Assert
        verify(mockSharedPreferences.getString(USER_CREDENTIALS_CACHE_NAME));
        expect(result, tUserCredentialsModelSuccess);
      },
    );

    test(
      'should throw CacheException when there are no user credentials cached',
      () async {
        // Arrange
        when(mockSharedPreferences.getString(any)).thenReturn(null);

        // Act
        final call = dataSource.getUserCredentials;

        // Assert
        expect(() => call(), throwsA(isA<CacheException>()));
      },
    );
  });

  group('cacheUserCredentials', () {
    final tUserCredentialsModelSuccess = UserCredentialsModel(
      userId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
      userToken:
          '713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5',
    );

    test(
      'should call SharedPreferences to cache the data',
      () async {
        // Act
        dataSource.cacheUserCredentials(tUserCredentialsModelSuccess);

        // Assert
        final jsonString = json.encode(tUserCredentialsModelSuccess.toJSON());
        verify(mockSharedPreferences.setString(
          USER_CREDENTIALS_CACHE_NAME,
          jsonString,
        ));
      },
    );
  });
}
