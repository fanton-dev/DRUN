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
  final PermissionHandler permissionHandler;
  final Future<Iterable<Contact>> Function() getContacts;

  ContactsLocalSourceImpl({
    @required this.permissionHandler,
    @required this.getContacts,
  })  : assert(permissionHandler != null),
        assert(getContacts != null);

  @override
  Future<List<LocalContactModel>> getLocalContactsFromAddressBook() async {
    Map<PermissionGroup, PermissionStatus> permissions;
    permissions = await permissionHandler.requestPermissions([
      PermissionGroup.contacts,
    ]);

    if (permissions[PermissionGroup.contacts] == PermissionStatus.granted) {
      final addressBook = await getContacts();
      return addressBook
          .where((e) {
            try {
              e.phones.first;
              return true;
            } on StateError {
              return false;
            }
          })
          .map((e) => LocalContactModel.fromContactsService(e))
          .toList();
    } else {
      throw PermissionException();
    }
  }
}
