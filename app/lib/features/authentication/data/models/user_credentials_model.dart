import 'package:meta/meta.dart';

import '../../domain/entities/user_credentials.dart';

class UserCredentialsModel extends UserCredentials {
  UserCredentialsModel({
    @required userId,
    @required userToken,
  }) : super(userId: userId, userToken: userToken);

  factory UserCredentialsModel.fromJSON(Map<String, dynamic> json) {
    return UserCredentialsModel(
      userId: json['userId'],
      userToken: json['userToken'],
    );
  }
}
