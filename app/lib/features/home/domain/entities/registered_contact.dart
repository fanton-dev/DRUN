import 'package:meta/meta.dart';

import 'contact.dart';

class RegisteredContact extends Contact {
  final String phoneNumber;
  final String userId;

  RegisteredContact({
    @required this.phoneNumber,
    @required this.userId,
  })  : assert(phoneNumber != null),
        assert(userId != null),
        super(phoneNumber: phoneNumber);
}
