import 'dart:convert';

import 'package:DRUN/core/constants/constants.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';

import '../models/authentication_sms_status_model.dart';
import '../models/user_credentials_model.dart';

abstract class UserAuthenticationRemoteSource {
  /// POST to https://drun.rocks/api/users/authenticate/send-sms-code endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<AuthenticationSmsStatusModel> sendAuthenticationSms(
    String phoneNumber,
  );

  /// POST to https://drun.rocks/api/users/authenticate/verify-sms-code endpoint.
  ///
  /// Throws a [ServerException] for all error codes.
  Future<UserCredentialsModel> verifyAuthenticationSms(
    String phoneNumber,
    String code,
  );
}

class UserAuthenticationRemoteSourceImpl
    implements UserAuthenticationRemoteSource {
  final http.Client httpClient;

  UserAuthenticationRemoteSourceImpl({
    @required this.httpClient,
  }) : assert(httpClient != null);

  @override
  Future<AuthenticationSmsStatusModel> sendAuthenticationSms(
    String phoneNumber,
  ) async {
    final response = await httpClient.post(
      '$SERVER_ADDRESS/users/authenticate/send-sms-code',
      body: {
        'phoneNumber': phoneNumber,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw ServerException();
    }

    return AuthenticationSmsStatusModel.fromJSON(json.decode(response.body));
  }

  @override
  Future<UserCredentialsModel> verifyAuthenticationSms(
    String phoneNumber,
    String code,
  ) async {
    final response = await httpClient.post(
      '$SERVER_ADDRESS/users/authenticate/verify-sms-code',
      body: {
        'phoneNumber': phoneNumber,
        'code': code,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200) {
      throw ServerException();
    }

    return UserCredentialsModel.fromJSON(json.decode(response.body));
  }
}
