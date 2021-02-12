import 'package:DRUN/core/platform/network_info.dart';
import 'package:DRUN/features/authentication/data/models/authentication_sms_status_model.dart';
import 'package:DRUN/features/authentication/data/repositories/user_authentication_repository_implementation.dart';
import 'package:DRUN/features/authentication/data/sources/user_authentication_local_source.dart';
import 'package:DRUN/features/authentication/data/sources/user_authentication_remote_source.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockUserAuthenticationRemoteSource extends Mock
    implements UserAuthenticationRemoteSource {}

class MockUserAuthenticationLocalSource extends Mock
    implements UserAuthenticationLocalSource {}

class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  UserAuthenticationRepositoryImplementation repository;
  MockUserAuthenticationRemoteSource mockUserAuthenticationRemoteSource;
  MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockUserAuthenticationRemoteSource = MockUserAuthenticationRemoteSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = UserAuthenticationRepositoryImplementation(
      remoteSource: mockUserAuthenticationRemoteSource,
      networkInfo: mockNetworkInfo,
    );
  });

  group('sendAuthenticationSms', () {
    final String tPhoneNumber = '+359735780085';
    final AuthenticationSmsStatusModel tAuthenticationSmsStatusModelSuccess =
        AuthenticationSmsStatusModel(
      phoneNumber: '+359735780085',
      succeeded: true,
    );

    test(
      'should check if device is online',
      () async {
        // Arrange
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);

        // Act
        repository.sendAuthenticationSms(tPhoneNumber);

        // Assert
        verify(mockNetworkInfo.isConnected);
      },
    );

    group('device is online', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      });

      test(
        'should return remote data when the call to remote source is successful',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          )).thenAnswer((_) async => tAuthenticationSmsStatusModelSuccess);

          // Act
          final result = await repository.sendAuthenticationSms(tPhoneNumber);

          // Assert
          verify(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          ));
          expect(result, Right(tAuthenticationSmsStatusModelSuccess));
        },
      );
    });
  });
}
