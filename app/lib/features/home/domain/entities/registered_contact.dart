import 'package:meta/meta.dart';

import 'contact.dart';

class RegisteredContact extends Contact {
  RegisteredContact({
    @required phoneNumber,
    @required userId,
  })  : assert(phoneNumber != null),
        assert(userId != null),
        super(phoneNumber: phoneNumber);
}
