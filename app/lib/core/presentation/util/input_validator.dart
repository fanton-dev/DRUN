import 'package:DRUN/core/errors/failures.dart';
import 'package:dartz/dartz.dart';

class InputValidator {
  Either<Failure, String> stringAsPhoneNumber(String string) {
    // Regular expression which matches all phone numbers starting with a
    // country code.
    //
    // Reference: https://coflutter.com/how-to-validate-phone-number-in-dart-flutter
    RegExp regExp = new RegExp(
      r'^[+][(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9()]{9,13}$',
    );

    if (string.length == 0 || !regExp.hasMatch(string)) {
      return Left(InvalidInputFailure());
    }

    return Right(string);
  }
}
