import 'package:meta/meta.dart';

import 'contact.dart';

class LocalContact extends Contact {
  final String name;
  final String phoneNumber;

  LocalContact({
    @required this.name,
    @required this.phoneNumber,
  })  : assert(name != null),
        assert(phoneNumber != null),
        super(phoneNumber: phoneNumber);
}
