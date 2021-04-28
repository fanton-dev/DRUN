import 'package:meta/meta.dart';

import '../../domain/entities/user_credentials.dart';

class UserCredentialsModel extends UserCredentials {
  UserCredentialsModel({
    @required userId,
    @required userToken,
  })  : assert(userId != null),
        assert(userToken != null),
        super(userId: userId, userToken: userToken);

  factory UserCredentialsModel.fromJSON(Map<String, dynamic> json) {
    return UserCredentialsModel(
      userId: json['userId'],
      userToken: json['userToken'],
    );
  }

  Map<String, dynamic> toJSON() {
    return {
      'userId': this.userId,
      'userToken': this.userToken,
    };
  }
}
