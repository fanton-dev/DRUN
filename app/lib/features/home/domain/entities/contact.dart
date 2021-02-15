import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class Contact extends Equatable {
  final String phoneNumber;

  Contact({
    @required this.phoneNumber,
  }) : assert(phoneNumber != null);

  @override
  List<Object> get props => [phoneNumber];
}
