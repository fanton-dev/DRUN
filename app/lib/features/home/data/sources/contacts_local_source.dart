import '../models/local_contact_model.dart';

abstract class ContactsLocalSource {
  /// Gets a list of [LocalContactModel]s from the phone's address book.
  ///
  /// Throws a [PermisionException] for all error codes.
  Future<List<LocalContactModel>> getLocalContactsFromAddressBook();
}
