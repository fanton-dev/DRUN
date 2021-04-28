import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/authentication/domain/entities/user_credentials.dart';
import 'package:DRUN/features/authentication/domain/repositories/user_authentication_repository.dart';
import 'package:DRUN/features/authentication/domain/usecases/get_logged_in_user.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockUserAuthenticationRepository extends Mock
    implements UserAuthenticationRepository {}

void main() {
  GetLoggedInUser usecase;
  MockUserAuthenticationRepository mockUserAuthenticationRepository;

  setUp(() {
    mockUserAuthenticationRepository = MockUserAuthenticationRepository();
    usecase = GetLoggedInUser(mockUserAuthenticationRepository);
  });

  final tUserCredentials = UserCredentials(
    userId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
    userToken: '713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5',
  );

  test(
    'should get a already logged in user from the repository',
    () async {
      // Arrange
      when(mockUserAuthenticationRepository.getLoggedInUser())
          .thenAnswer((_) async => Right(tUserCredentials));

      // Act
      final result = await usecase(NoParams());

      // Assert
      expect(result, Right(tUserCredentials));
      verify(
        mockUserAuthenticationRepository.getLoggedInUser(),
      );
      verifyNoMoreInteractions(mockUserAuthenticationRepository);
    },
  );
}
