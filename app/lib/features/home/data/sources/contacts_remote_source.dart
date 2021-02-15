import '../models/registered_contact_model.dart';

abstract class ContactsRemoteSource {
  /// GET to https://$SERVER_ADDRESS/api/users/check-registered endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<List<RegisteredContactModel>> getRegisteredUsersFromPhonesNumbers(
    List<String> phoneNumbers,
  );
}
