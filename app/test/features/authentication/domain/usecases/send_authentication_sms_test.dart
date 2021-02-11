import 'package:DRUN/features/authentication/domain/entities/authentication_sms_status.dart';
import 'package:DRUN/features/authentication/domain/repositories/user_authentication_repository.dart';
import 'package:DRUN/features/authentication/domain/usecases/send_authentication_sms.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockUserAuthenticationRepository extends Mock
    implements UserAuthenticationRepository {}

void main() {
  SendAuthenticationSms usecase;
  MockUserAuthenticationRepository mockUserAuthenticationRepository;

  setUp(() {
    mockUserAuthenticationRepository = MockUserAuthenticationRepository();
    usecase = SendAuthenticationSms(mockUserAuthenticationRepository);
  });

  final tPhoneNumber = '+359735780085';
  final tAuthenticationSmsStatus = AuthenticationSmsStatus(
    phoneNumber: '+359735780085',
    succeeded: true,
  );

  test(
    'should request an authentication sms from the repository',
    () async {
      // Arrange
      when(mockUserAuthenticationRepository.sendAuthenticationSms(tPhoneNumber))
          .thenAnswer((_) async => Right(tAuthenticationSmsStatus));

      // Act
      final result = await usecase(Params(phoneNumber: tPhoneNumber));

      // Assert
      expect(result, Right(tAuthenticationSmsStatus));
      verify(
        mockUserAuthenticationRepository.sendAuthenticationSms(tPhoneNumber),
      );
      verifyNoMoreInteractions(mockUserAuthenticationRepository);
    },
  );
}
