part of 'home_bloc.dart';

abstract class HomeEvent extends Equatable {
  const HomeEvent();

  @override
  List<Object> get props => [];
}

class GetContactsEvent extends HomeEvent {
  final UserCredentials userCredentials;

  GetContactsEvent(this.userCredentials);
}

class HomeContactSelectedEvent extends HomeEvent {
  final UserCredentials userCredentials;
  final List<CompleteContact> contacts;
  final String selectedUserId;

  HomeContactSelectedEvent(
    this.userCredentials,
    this.contacts,
    this.selectedUserId,
  );
}
