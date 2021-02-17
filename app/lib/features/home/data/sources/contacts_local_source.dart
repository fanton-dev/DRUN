import 'package:contacts_service/contacts_service.dart';
import 'package:meta/meta.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../../core/errors/exceptions.dart';
import '../models/local_contact_model.dart';

abstract class ContactsLocalSource {
  /// Gets a list of [LocalContactModel]s from the phone's address book.
  ///
  /// Throws a [PermissionException] for all error codes.
  Future<List<LocalContactModel>> getLocalContactsFromAddressBook();
}

class ContactsLocalSourceImpl implements ContactsLocalSource {
  final Future<PermissionStatus> Function() requestContactsPermissions;
  final Future<Iterable<Contact>> Function() getContacts;

  ContactsLocalSourceImpl({
    @required this.requestContactsPermissions,
    @required this.getContacts,
  })  : assert(requestContactsPermissions != null),
        assert(getContacts != null);

  @override
  Future<List<LocalContactModel>> getLocalContactsFromAddressBook() async {
    if (await requestContactsPermissions().isGranted) {
      final addressBook = await getContacts();
      return addressBook
          .map((e) => LocalContactModel.fromContactsService(e))
          .toList();
    } else {
      throw PermissionException();
    }
  }
}
