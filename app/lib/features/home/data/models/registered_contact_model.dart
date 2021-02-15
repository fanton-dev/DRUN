import 'package:meta/meta.dart';

import '../../domain/entities/registered_contact.dart';

class RegisteredContactModel extends RegisteredContact {
  RegisteredContactModel({
    @required phoneNumber,
    @required userId,
  })  : assert(phoneNumber != null),
        assert(userId != null),
        super(phoneNumber: phoneNumber, userId: userId);

  @override
  factory RegisteredContactModel.fromJSON(Map<String, dynamic> json) {
    return RegisteredContactModel(
      phoneNumber: json['phoneNumber'],
      userId: json['userId'],
    );
  }
}
