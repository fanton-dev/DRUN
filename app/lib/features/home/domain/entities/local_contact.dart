import 'package:meta/meta.dart';

import 'contact.dart';

class LocalContact extends Contact {
  LocalContact({
    @required name,
    @required phoneNumber,
  })  : assert(name != null),
        assert(phoneNumber != null),
        super(phoneNumber: phoneNumber);
}
