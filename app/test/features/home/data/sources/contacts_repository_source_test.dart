import 'dart:convert';

import 'package:DRUN/core/constants/constants.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/home/data/models/registered_contact_model.dart';
import 'package:DRUN/features/home/data/sources/contacts_remote_source.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/mockito.dart';

import '../../../../fixtures/fixture_parser.dart';

class MockHttpClient extends Mock implements http.Client {}

void main() {
  ContactsRemoteSourceImpl dataSource;
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
    dataSource = ContactsRemoteSourceImpl(
      httpClient: mockHttpClient,
    );
  });

  final tPhoneNumbers = <String>[
    '+359735780085',
    '+359800857357',
    '+359888888888'
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

  group('sendAuthenticationSms', () {
    test(
      'should perform a GET on "/api/users/check-registered" endpoint',
      () async {
        // Arrange
        arrangeMockHttpClientPost(fixture('registered_contacts.json'), 200);

        // Act
        dataSource.getRegisteredUsersFromPhonesNumbers(tPhoneNumbers);

        // Assert
        verify(mockHttpClient.post(
          '$SERVER_ADDRESS/api/users/check-registered',
          body: jsonEncode({
            'phoneNumbers': tPhoneNumbers,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        ));
      },
    );

    test(
      'should return a list of RegisteredContactModels when the status code is 200',
      () async {
        // Arrange
        arrangeMockHttpClientPost(fixture('registered_contacts.json'), 200);

        // Act
        final result = await dataSource.getRegisteredUsersFromPhonesNumbers(
          tPhoneNumbers,
        );

        // Assert
        for (var i = 0; i < tRegisteredContacts.length; i++) {
          expect(result[i], tRegisteredContacts[i]);
        }
      },
    );

    test(
      'should throw a ServerException when the status code is 4xx',
      () async {
        // Arrange
        arrangeMockHttpClientPost(fixture('registered_contacts.json'), 400);

        // Act
        final call = dataSource.getRegisteredUsersFromPhonesNumbers;

        // Assert
        expect(
          () async => call(tPhoneNumbers),
          throwsA(
            isA<ServerException>(),
          ),
        );
      },
    );
  });
}
