import 'dart:convert';

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

const CACHE_KEY = 'CACHED_USER_CREDENTIALS';

class UserAuthenticationLocalSourceImpl
    implements UserAuthenticationLocalSource {
  final SharedPreferences sharedPreferences;

  UserAuthenticationLocalSourceImpl({
    @required this.sharedPreferences,
  });

  @override
  Future<UserCredentialsModel> getUserCredentials() {
    final jsonString = sharedPreferences.getString(CACHE_KEY);

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
    return sharedPreferences.setString(CACHE_KEY, jsonString);
  }
}
