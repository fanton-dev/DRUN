import 'package:meta/meta.dart';

import 'contact.dart';

class CompleteContact extends Contact {
  CompleteContact({
    @required name,
    @required phoneNumber,
    @required userId,
  })  : assert(name != null),
        assert(phoneNumber != null),
        assert(userId != null),
        super(phoneNumber: phoneNumber);
}
