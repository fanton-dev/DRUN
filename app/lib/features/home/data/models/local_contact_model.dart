import 'package:contacts_service/contacts_service.dart';
import 'package:meta/meta.dart';

import '../../domain/entities/local_contact.dart';

class LocalContactModel extends LocalContact {
  LocalContactModel({
    @required name,
    @required phoneNumber,
  })  : assert(name != null),
        assert(phoneNumber != null),
        super(name: name, phoneNumber: phoneNumber);

  @override
  factory LocalContactModel.fromContactsService(Contact contact) {
    return LocalContactModel(
      name: contact.displayName,
      phoneNumber: contact.phones.first.value,
    );
  }
}
