import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class UserCredentials extends Equatable {
  final String userId;
  final String userToken;

  UserCredentials({
    @required this.userId,
    @required this.userToken,
  });

  @override
  List<Object> get props => [userId, userToken];
}
