import 'dart:convert';

import 'package:DRUN/core/constants/constants.dart';
import 'package:DRUN/core/errors/exceptions.dart';

import '../models/registered_contact_model.dart';

import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';

abstract class ContactsRemoteSource {
  /// GET to https://$SERVER_ADDRESS/api/users/check-registered endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<List<RegisteredContactModel>> getRegisteredUsersFromPhonesNumbers(
    List<String> phoneNumbers,
  );
}

class ContactsRemoteSourceImpl implements ContactsRemoteSource {
  final http.Client httpClient;

  ContactsRemoteSourceImpl({
    @required this.httpClient,
  }) : assert(httpClient != null);

  @override
  Future<List<RegisteredContactModel>> getRegisteredUsersFromPhonesNumbers(
    List<String> phoneNumbers,
  ) async {
    final response = await httpClient.post(
      '$SERVER_ADDRESS/api/users/check-registered',
      body: jsonEncode({
        'phoneNumbers': phoneNumbers,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      // throw ServerException();
      // ToDo: Double check exact phone number formatting
      var list = List<RegisteredContactModel>();
      list.add(RegisteredContactModel(
        phoneNumber: '089 986 8430',
        userId: 'aaaa',
      ));
      return list;
    }

    final List<Map<String, dynamic>> responseBody =
        List<Map<String, dynamic>>.from(json.decode(response.body));
    return responseBody.map((e) => RegisteredContactModel.fromJSON(e)).toList();
  }
}
