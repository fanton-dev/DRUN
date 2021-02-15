import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/core/data/sources/network_info.dart';
import 'package:DRUN/features/authentication/data/models/authentication_sms_status_model.dart';
import 'package:DRUN/features/authentication/data/models/user_credentials_model.dart';
import 'package:DRUN/features/authentication/data/repositories/user_authentication_repository_impl.dart';
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
  UserAuthenticationRepositoryImpl repository;
  MockUserAuthenticationRemoteSource mockUserAuthenticationRemoteSource;
  MockUserAuthenticationLocalSource mockUserAuthenticationLocalSource;
  MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockUserAuthenticationRemoteSource = MockUserAuthenticationRemoteSource();
    mockUserAuthenticationLocalSource = MockUserAuthenticationLocalSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = UserAuthenticationRepositoryImpl(
      remoteSource: mockUserAuthenticationRemoteSource,
      localSource: mockUserAuthenticationLocalSource,
      networkInfo: mockNetworkInfo,
    );
  });

  final String tPhoneNumber = '+359735780085';
  final String tCode = '888888';
  final AuthenticationSmsStatusModel tAuthenticationSmsStatusModelSuccess =
      AuthenticationSmsStatusModel(
    phoneNumber: '+359735780085',
    succeeded: true,
  );
  final UserCredentialsModel tUserCredentialsModel = UserCredentialsModel(
    userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
    userToken: "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
  );

  group('sendAuthenticationSms', () {
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

      test(
        'should return server failure when the call to remote data source is unsuccessful',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          )).thenThrow(ServerException());

          // Act
          final result = await repository.sendAuthenticationSms(tPhoneNumber);

          // Assert
          verify(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          ));
          verifyZeroInteractions(mockUserAuthenticationLocalSource);
          expect(result, Left(ServerFailure()));
        },
      );
    });

    group('device is offline', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      });

      test(
        'should return network failure when there is no internet connection',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          )).thenAnswer((_) async => tAuthenticationSmsStatusModelSuccess);

          // Act
          final result = await repository.sendAuthenticationSms(tPhoneNumber);

          // Assert
          verifyNever(mockUserAuthenticationRemoteSource.sendAuthenticationSms(
            tPhoneNumber,
          ));
          verifyZeroInteractions(mockUserAuthenticationLocalSource);
          expect(result, Left(NetworkFailure()));
        },
      );
    });
  });

  group('verifyAuthenticationSms', () {
    test(
      'should check if device is online',
      () async {
        // Arrange
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);

        // Act
        repository.verifyAuthenticationSms(tPhoneNumber, tCode);

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
          when(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          )).thenAnswer((_) async => tUserCredentialsModel);

          // Act
          final result = await repository.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          );

          // Assert
          verify(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          ));
          expect(result, Right(tUserCredentialsModel));
        },
      );

      test(
        'should cache the data locally',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          )).thenAnswer((_) async => tUserCredentialsModel);

          // Act
          await repository.verifyAuthenticationSms(tPhoneNumber, tCode);

          // Assert
          verify(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          ));
          verify(mockUserAuthenticationLocalSource.cacheUserCredentials(
            tUserCredentialsModel,
          ));
        },
      );

      test(
        'should return server failure when the call to remote data source is unsuccessful',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          )).thenThrow(ServerException());

          // Act
          final result = await repository.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          );

          // Assert
          verify(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          ));
          verifyZeroInteractions(mockUserAuthenticationLocalSource);
          expect(result, Left(ServerFailure()));
        },
      );
    });

    group('device is offline', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      });

      test(
        'should return network failure when there is no internet connection',
        () async {
          // Arrange
          when(mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          )).thenAnswer((_) async => tUserCredentialsModel);

          // Act
          final result = await repository.verifyAuthenticationSms(
            tPhoneNumber,
            tCode,
          );

          // Assert
          verifyNever(
            mockUserAuthenticationRemoteSource.verifyAuthenticationSms(
              tPhoneNumber,
              tCode,
            ),
          );
          verifyZeroInteractions(mockUserAuthenticationLocalSource);
          expect(result, Left(NetworkFailure()));
        },
      );
    });
  });

  group('getLoggedInUser', () {
    test(
      'should use locally cached data',
      () async {
        // Arrange
        when(mockUserAuthenticationLocalSource.getUserCredentials())
            .thenAnswer((_) async => tUserCredentialsModel);

        // Act
        final result = await repository.getLoggedInUser();

        // Assert
        verify(mockUserAuthenticationLocalSource.getUserCredentials());
        verifyZeroInteractions(mockUserAuthenticationRemoteSource);
        expect(result, Right(tUserCredentialsModel));
      },
    );

    test(
      'should return cache failure when there is no user credentials stored',
      () async {
        // Arrange
        when(mockUserAuthenticationLocalSource.getUserCredentials())
            .thenThrow(CacheException());

        // Act
        final result = await repository.getLoggedInUser();

        // Assert
        verifyZeroInteractions(mockUserAuthenticationRemoteSource);
        expect(result, Left(CacheFailure()));
      },
    );
  });
}
