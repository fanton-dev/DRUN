import '../models/user_credentials_model.dart';

abstract class UserAuthenticationLocalSource {
  /// Get the cached [UserCredentialsModel] which was gotten when the user
  /// authenticated.
  ///
  /// Throws a [CacheException] for all error codes.
  Future<UserCredentialsModel> getUserCredentials();

  Future<void> cacheUserCredentials(UserCredentialsModel userCredentials);
}
