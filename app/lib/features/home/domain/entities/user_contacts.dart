import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class UserContacts extends Equatable {
  final List<UserContact> userContacts;

  UserContacts({@required this.userContacts}) : assert(userContacts != null);

  @override
  List<Object> get props => [userContacts];
}

class UserContact extends Equatable {
  final String phoneNumber;

  UserContact({
    @required this.phoneNumber,
  }) : assert(phoneNumber != null);

  @override
  List<Object> get props => [phoneNumber];
}

class LocalUserContact extends UserContact {
  final String name;
  final String phoneNumber;

  LocalUserContact({
    @required this.name,
    @required this.phoneNumber,
  })  : assert(name != null),
        assert(phoneNumber != null),
        super(phoneNumber: phoneNumber);
}

class RegisteredUserContact extends UserContact {
  final String phoneNumber;
  final String userId;

  RegisteredUserContact({
    @required this.phoneNumber,
    @required this.userId,
  })  : assert(userId != null),
        assert(phoneNumber != null),
        super(phoneNumber: phoneNumber);
}

class CompleteContact extends UserContact {
  final String phoneNumber;
  final String name;
  final String userId;

  CompleteContact({
    @required this.name,
    @required this.phoneNumber,
    @required this.userId,
  })  : assert(name != null),
        assert(phoneNumber != null),
        assert(userId != null),
        super(phoneNumber: phoneNumber);
}
