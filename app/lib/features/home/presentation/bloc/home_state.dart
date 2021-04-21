part of 'home_bloc.dart';

abstract class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object> get props => [];
}

class HomeInitialState extends HomeState {}

class HomeAuthenticatedState extends HomeState {
  final UserCredentials userCredentials;
  final List<CompleteContact> contacts;

  HomeAuthenticatedState({
    @required this.userCredentials,
    @required this.contacts,
  });
}

class HomeFailureState extends HomeState {
  final String message;

  HomeFailureState({@required this.message});
}

class HomeContactSelectedState extends HomeState {
  final UserCredentials userCredentials;
  final CompleteContact selectedContact;

  HomeContactSelectedState({
    @required this.userCredentials,
    @required this.selectedContact,
  });
}
