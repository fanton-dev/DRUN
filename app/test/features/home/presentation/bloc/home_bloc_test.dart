import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/authentication/domain/entities/user_credentials.dart';
import 'package:DRUN/features/home/domain/entities/complete_contact.dart';
import 'package:DRUN/features/home/domain/usecases/get_contacts.dart';
import 'package:DRUN/features/home/presentation/bloc/home_bloc.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockGetContacts extends Mock implements GetContacts {}

void main() {
  HomeBloc bloc;
  MockGetContacts mockGetContacts;

  setUp(() {
    mockGetContacts = MockGetContacts();
    bloc = HomeBloc(getContacts: mockGetContacts);
  });

  test(
    'initialState should be HomeInitialState',
    () async {
      expect(bloc.initialState, HomeInitialState());
    },
  );

  group('GetContactsEvent', () {
    final tUserCredentials = UserCredentials(
      userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
      userToken:
          "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
    );

    final tCompleteContacts = <CompleteContact>[
      CompleteContact(
        name: 'Gosho Losho',
        phoneNumber: '+359735780085',
        userId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
      ),
      CompleteContact(
        name: 'Oshte Gosho',
        phoneNumber: '+359888888888',
        userId: '2cc9754b-2520-4dad-be5f-2da3e3341800',
      ),
    ];

    test(
      'should get data from the GetContacts usecase',
      () async {
        // Arrange
        when(mockGetContacts(any))
            .thenAnswer((_) async => Right(tCompleteContacts));

        // Act
        bloc.add(GetContactsEvent(tUserCredentials));
        await untilCalled(mockGetContacts(any));

        // Assert
        verify(mockGetContacts(NoParams()));
      },
    );

    test(
      'should emit HomeFailedState when there is a failure',
      () async {
        // Arrange
        when(mockGetContacts(any))
            .thenAnswer((_) async => Left(PermissionFailure()));

        // Assert later
        final expected = [
          HomeInitialState(),
          HomeFailureState(message: PermissionFailure().message)
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetContactsEvent(tUserCredentials));
      },
    );

    test(
      'should emit HomeAuthenticatedState when contacts are successfully loaded',
      () async {
        // Arrange
        when(mockGetContacts(any))
            .thenAnswer((_) async => Right(tCompleteContacts));

        // Assert later
        final expected = [
          HomeInitialState(),
          HomeAuthenticatedState(
            userCredentials: tUserCredentials,
            contacts: tCompleteContacts,
          ),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetContactsEvent(tUserCredentials));
      },
    );
  });

  group('HomeContactSelectedEvent', () {
    final tUserCredentials = UserCredentials(
      userId: "4ade5874-c573-4c8f-b2b8-7db5fccd983b",
      userToken:
          "713ADC1F515B3E0BBDF964DBAE6257A5B8A617115816A1705EACF9C00394A5",
    );

    final tCompleteContacts = <CompleteContact>[
      CompleteContact(
        name: 'Gosho Losho',
        phoneNumber: '+359735780085',
        userId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
      ),
      CompleteContact(
        name: 'Oshte Gosho',
        phoneNumber: '+359888888888',
        userId: '2cc9754b-2520-4dad-be5f-2da3e3341800',
      ),
    ];

    test(
      'should emit HomeContactSelectedState and HomeFailureState when an invalid userId is selected',
      () async {
        // Arrange
        when(mockGetContacts(any))
            .thenAnswer((_) async => Right(tCompleteContacts));

        // Assert later
        final expected = [
          HomeInitialState(),
          HomeAuthenticatedState(
            userCredentials: tUserCredentials,
            contacts: tCompleteContacts,
          ),
          HomeFailureState(message: ContactSelectionFailure().message),
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetContactsEvent(tUserCredentials));
        bloc.add(HomeContactSelectedEvent(
          tUserCredentials,
          tCompleteContacts,
          'non-existent id',
        ));
      },
    );

    test(
      'should emit HomeContactSelectedState and HomeContactSelectedState when an valid userId is selected',
      () async {
        // Arrange
        when(mockGetContacts(any))
            .thenAnswer((_) async => Right(tCompleteContacts));

        // Assert later
        final expected = [
          HomeInitialState(),
          HomeAuthenticatedState(
            userCredentials: tUserCredentials,
            contacts: tCompleteContacts,
          ),
          HomeContactSelectedState(
            userCredentials: tUserCredentials,
            selectedContact: tCompleteContacts[0],
          )
        ];
        expectLater(bloc, emitsInOrder(expected));

        // Act
        bloc.add(GetContactsEvent(tUserCredentials));
        bloc.add(HomeContactSelectedEvent(
          tUserCredentials,
          tCompleteContacts,
          '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
        ));
      },
    );
  });
}
