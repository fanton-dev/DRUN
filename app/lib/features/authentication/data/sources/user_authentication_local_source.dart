import 'dart:convert';

import 'package:DRUN/core/constants/constants.dart';
import 'package:meta/meta.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../core/errors/exceptions.dart';
import '../models/user_credentials_model.dart';

abstract class UserAuthenticationLocalSource {
  /// Get the cached [UserCredentialsModel] which was gotten when the user
  /// authenticated.
  ///
  /// Throws a [CacheException] for all error codes.
  Future<UserCredentialsModel> getUserCredentials();

  Future<void> cacheUserCredentials(UserCredentialsModel userCredentials);
}

class UserAuthenticationLocalSourceImpl
    implements UserAuthenticationLocalSource {
  final SharedPreferences sharedPreferences;

  UserAuthenticationLocalSourceImpl({
    @required this.sharedPreferences,
  }) : assert(sharedPreferences != null);

  @override
  Future<UserCredentialsModel> getUserCredentials() {
    final jsonString = sharedPreferences.getString(USER_CREDENTIALS_CACHE_NAME);

    if (jsonString == null) {
      throw CacheException();
    }

    return Future.value(UserCredentialsModel.fromJSON(json.decode(jsonString)));
  }

  @override
  Future<void> cacheUserCredentials(
    UserCredentialsModel userCredentials,
  ) async {
    final jsonString = json.encode(userCredentials.toJSON());
    return sharedPreferences.setString(USER_CREDENTIALS_CACHE_NAME, jsonString);
  }
}
