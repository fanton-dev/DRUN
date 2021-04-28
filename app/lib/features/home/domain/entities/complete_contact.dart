import 'package:meta/meta.dart';

import 'contact.dart';

class CompleteContact extends Contact {
  final String name;
  final String phoneNumber;
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
