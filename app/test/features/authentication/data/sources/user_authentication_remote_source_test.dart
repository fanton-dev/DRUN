import 'package:DRUN/core/constants/constants.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/authentication/data/models/authentication_sms_status_model.dart';
import 'package:DRUN/features/authentication/data/models/user_credentials_model.dart';
import 'package:DRUN/features/authentication/data/sources/user_authentication_remote_source.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;

import '../../../../fixtures/fixture_parser.dart';

class MockHttpClient extends Mock implements http.Client {}

void main() {
  UserAuthenticationRemoteSourceImpl dataSource;
  MockHttpClient mockHttpClient;

  void arrangeMockHttpClientPost(body, statusCode) {
    when(mockHttpClient.post(
      any,
      body: anyNamed('body'),
      headers: anyNamed('headers'),
    )).thenAnswer(
      (_) async => http.Response(
        body,
        statusCode,
      ),
    );
  }

  setUp(() {
    mockHttpClient = MockHttpClient();
    dataSource = UserAuthenticationRemoteSourceImpl(
      httpClient: mockHttpClient,
    );
  });

  group('sendAuthenticationSms', () {
    final tPhoneNumber = '+359735780085';
    final tAuthenticationSmsStatusModelSuccess = AuthenticationSmsStatusModel(
      phoneNumber: '+359735780085',
      succeeded: true,
    );

    test(
      'should perform a POST on "/api/users/authenticate/send-sms-code" endpoint',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('authentication_sms_status_success.json'),
          200,
        );

        // Act
        dataSource.sendAuthenticationSms(tPhoneNumber);

        // Assert
        verify(mockHttpClient.post(
          '$SERVER_ADDRESS/users/authenticate/send-sms-code',
          body: {
            'phoneNumber': tPhoneNumber,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        ));
      },
    );

    test(
      'should return AuthenticationSmsStatusModel when the status code is 200',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('authentication_sms_status_success.json'),
          200,
        );

        // Act
        final result = await dataSource.sendAuthenticationSms(tPhoneNumber);

        // Assert
        expect(result, tAuthenticationSmsStatusModelSuccess);
      },
    );

    test(
      'should throw a ServerException when the status code is 4xx',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('authentication_sms_status_failure.json'),
          400,
        );

        // Act
        final call = dataSource.sendAuthenticationSms;

        // Assert
        expect(() async => call(tPhoneNumber), throwsA(isA<ServerException>()));
      },
    );
  });

  group('verifyAuthenticationSms', () {
    final tPhoneNumber = '+359735780085';
    final tCode = '888888';
    final tUserCredentialsModelSuccess = UserCredentialsModel(
      userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
      userToken:
          "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
    );

    test(
      'should perform a POST on "/api/users/authenticate/verify-sms-code" endpoint',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('user_credentials_success.json'),
          200,
        );

        // Act
        dataSource.verifyAuthenticationSms(tPhoneNumber, tCode);

        // Assert
        verify(mockHttpClient.post(
          '$SERVER_ADDRESS/users/authenticate/verify-sms-code',
          body: {
            'phoneNumber': tPhoneNumber,
            'code': tCode,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        ));
      },
    );

    test(
      'should return AuthenticationSmsStatusModel when the status code is 200',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('user_credentials_success.json'),
          200,
        );

        // Act
        final result = await dataSource.verifyAuthenticationSms(
          tPhoneNumber,
          tCode,
        );

        // Assert
        expect(result, tUserCredentialsModelSuccess);
      },
    );

    test(
      'should throw a ServerException when the status code is 4xx',
      () async {
        // Arrange
        arrangeMockHttpClientPost(
          fixture('user_credentials_failure.json'),
          400,
        );

        // Act
        final call = dataSource.verifyAuthenticationSms;

        // Assert
        expect(
          () async => call(tPhoneNumber, tCode),
          throwsA(isA<ServerException>()),
        );
      },
    );
  });
}
