import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/core/presentation/util/input_validator.dart';
import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/authentication/domain/entities/authentication_sms_status.dart';
import 'package:DRUN/features/authentication/domain/entities/user_credentials.dart';
import 'package:DRUN/features/authentication/domain/usecases/get_logged_in_user.dart';
import 'package:DRUN/features/authentication/domain/usecases/send_authentication_sms.dart';
import 'package:DRUN/features/authentication/domain/usecases/verify_authentication_sms.dart';
import 'package:DRUN/features/authentication/presentation/bloc/authentication_bloc.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockGetLoggedInUser extends Mock implements GetLoggedInUser {}

class MockSendAuthenticationSms extends Mock implements SendAuthenticationSms {}

class MockVerifyAuthenticationSms extends Mock
    implements VerifyAuthenticationSms {}

class MockInputValidator extends Mock implements InputValidator {}

void main() {
  AuthenticationBloc bloc;
  MockGetLoggedInUser mockGetLoggedInUser;
  MockSendAuthenticationSms mockSendAuthenticationSms;
  MockVerifyAuthenticationSms mockVerifyAuthenticationSms;
  MockInputValidator mockInputValidator;

  setUp(() {
    mockGetLoggedInUser = MockGetLoggedInUser();
    mockSendAuthenticationSms = MockSendAuthenticationSms();
    mockVerifyAuthenticationSms = MockVerifyAuthenticationSms();
    mockInputValidator = MockInputValidator();
    bloc = AuthenticationBloc(
      getLoggedInUser: mockGetLoggedInUser,
      sendAuthenticationSms: mockSendAuthenticationSms,
      verifyAuthenticationSms: mockVerifyAuthenticationSms,
      inputValidator: mockInputValidator,
    );
  });

  test(
    'initialState should be AuthenticationInitial',
    () async {
      expect(bloc.initialState, AuthenticationInitialState());
    },
  );

  group('GetLoggedInUserEvent', () {
    final tUserCredentials = UserCredentials(
      userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
      userToken:
          "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
    );

    test(
      'should get data from the GetLoggedInUser usecase',
      () async {
        // Arrange
        when(mockGetLoggedInUser(any))
            .thenAnswer((_) async => Right(tUserCredentials));

        // Act
        bloc.add(GetLoggedInUserEvent());
        await untilCalled(mockGetLoggedInUser(any));

        // Assert
        verify(mockGetLoggedInUser(NoParams()));
      },
    );

    test(
      'should do nothing when there are no cached UserCredentials',
      () async {
        // Arrange
        when(mockGetLoggedInUser(any))
            .thenAnswer((_) async => Left(CacheFailure()));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetLoggedInUserEvent());
      },
    );

    test(
      'should emit AuthenticationSuccessfulState when there are UserCredentials cached',
      () async {
        // Arrange
        when(mockGetLoggedInUser(any))
            .thenAnswer((_) async => Right(tUserCredentials));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationLoadingState(),
          AuthenticationSuccessfulState(userCredentials: tUserCredentials),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetLoggedInUserEvent());
      },
    );
  });

  group('StartAuthenticationEvent', () {
    test(
      'should emit AuthenticationPhoneInputState',
      () async {
        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationPhoneInputState(),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(StartAuthenticationEvent());
      },
    );
  });

  group('SendAuthenticationSmsEvent', () {
    final tPhoneNumber = '+359735780085';
    final tAuthenticationSmsStatus = AuthenticationSmsStatus(
      phoneNumber: '+359735780085',
      succeeded: true,
    );

    test(
      'should call the InputValidator to validate phoneNumber',
      () async {
        // Arrange
        when(mockInputValidator.stringAsPhoneNumber(tPhoneNumber))
            .thenReturn(Right(tPhoneNumber));

        // Act
        bloc.add(SendAuthenticationSmsEvent(tPhoneNumber));
        await untilCalled(mockInputValidator.stringAsPhoneNumber(any));

        // Assert
        verify(mockInputValidator.stringAsPhoneNumber(tPhoneNumber));
      },
    );

    test(
      'should emit AuthenticationPhoneInputErrorState when the input is invalid',
      () async {
        // Arrange
        when(mockInputValidator.stringAsPhoneNumber(any)).thenReturn(
          Left(InvalidInputFailure()),
        );

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationPhoneInputErrorState(
              message: InvalidInputFailure().message)
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(SendAuthenticationSmsEvent(tPhoneNumber));
      },
    );

    test(
      'should get data from the SendAuthenticationSms usecase',
      () async {
        // Arrange
        when(mockInputValidator.stringAsPhoneNumber(tPhoneNumber))
            .thenReturn(Right(tPhoneNumber));

        when(mockSendAuthenticationSms(any))
            .thenAnswer((_) async => Right(tAuthenticationSmsStatus));

        // Act
        bloc.add(SendAuthenticationSmsEvent(tPhoneNumber));
        await untilCalled(mockSendAuthenticationSms(any));

        // Assert
        verify(
          mockSendAuthenticationSms(SendParams(phoneNumber: tPhoneNumber)),
        );
      },
    );

    test(
      'should emit AuthenticationLoadingState and AuthenticationCodeInputState when data is gotten',
      () async {
        // Arrange
        when(mockInputValidator.stringAsPhoneNumber(tPhoneNumber))
            .thenReturn(Right(tPhoneNumber));

        when(mockSendAuthenticationSms(any))
            .thenAnswer((_) async => Right(tAuthenticationSmsStatus));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationLoadingState(),
          AuthenticationCodeInputState(
            authenticationSmsStatus: tAuthenticationSmsStatus,
          ),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(SendAuthenticationSmsEvent(tPhoneNumber));
      },
    );

    test(
      'should emit AuthenticationLoadingState and AuthenticationPhoneInputErrorState when the usecase fails',
      () async {
        // Arrange
        when(mockInputValidator.stringAsPhoneNumber(tPhoneNumber))
            .thenReturn(Right(tPhoneNumber));

        when(mockSendAuthenticationSms(any))
            .thenAnswer((_) async => Left(ServerFailure()));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationLoadingState(),
          AuthenticationPhoneInputErrorState(message: ServerFailure().message),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(SendAuthenticationSmsEvent(tPhoneNumber));
      },
    );
  });

  group('VerifyAuthenticationSmsEvent', () {
    final tPhoneNumber = '+359735780085';
    final tCode = '888888';
    final tUserCredentials = UserCredentials(
      userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
      userToken:
          "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
    );

    test(
      'should get data from the VerifyAuthenticationSms usecase',
      () async {
        // Arrange
        when(mockVerifyAuthenticationSms(any))
            .thenAnswer((_) async => Right(tUserCredentials));

        // Act
        bloc.add(VerifyAuthenticationSmsEvent(tPhoneNumber, tCode));
        await untilCalled(mockVerifyAuthenticationSms(any));

        // Assert
        verify(
          mockVerifyAuthenticationSms(VerifyParams(
            phoneNumber: tPhoneNumber,
            code: tCode,
          )),
        );
      },
    );

    test(
      'should emit AuthenticationLoadingState and AuthenticationSuccessfulState when data is gotten',
      () async {
        // Arrange
        when(mockVerifyAuthenticationSms(any))
            .thenAnswer((_) async => Right(tUserCredentials));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationLoadingState(),
          AuthenticationSuccessfulState(userCredentials: tUserCredentials),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(VerifyAuthenticationSmsEvent(tPhoneNumber, tCode));
      },
    );

    test(
      'should emit AuthenticationLoadingState and AuthenticationCodeInputErrorState when the usecase fails',
      () async {
        // Arrange
        when(mockVerifyAuthenticationSms(any))
            .thenAnswer((_) async => Left(ServerFailure()));

        // Assert later
        final expected = [
          AuthenticationInitialState(),
          AuthenticationLoadingState(),
          AuthenticationCodeInputErrorState(
            phoneNumber: tPhoneNumber,
            message: ServerFailure().message,
          ),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(VerifyAuthenticationSmsEvent(tPhoneNumber, tCode));
      },
    );
  });
}
