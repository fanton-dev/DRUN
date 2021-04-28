import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/core/presentation/util/input_validator.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  InputValidator inputValidator;

  setUp(() {
    inputValidator = InputValidator();
  });

  group('stringAsPhoneNumber', () {
    test(
      'should return the same phone number on a validly formated phone number',
      () async {
        // Arrange
        final tPhoneNumber1 = '+359735780085';
        final tPhoneNumber2 = '+359 735 780 085';
        final tPhoneNumber3 = '+359 (735) 780 085';
        final tPhoneNumber4 = '+359 735-780-085';
        final tPhoneNumber5 = '+1735780085';

        // Act
        final result1 = inputValidator.stringAsPhoneNumber(tPhoneNumber1);
        final result2 = inputValidator.stringAsPhoneNumber(tPhoneNumber2);
        final result3 = inputValidator.stringAsPhoneNumber(tPhoneNumber3);
        final result4 = inputValidator.stringAsPhoneNumber(tPhoneNumber4);
        final result5 = inputValidator.stringAsPhoneNumber(tPhoneNumber5);

        // Assert
        expect(result1, Right(tPhoneNumber1));
        expect(result2, Right(tPhoneNumber2));
        expect(result3, Right(tPhoneNumber3));
        expect(result4, Right(tPhoneNumber4));
        expect(result5, Right(tPhoneNumber5));
      },
    );

    test(
      'should return InvalidInputFailure on a invalid phone number',
      () async {
        // Arrange
        final tPhoneNumber1 = 'aaaaaaa';
        final tPhoneNumber2 = 'a8a8a8a8a8@';
        final tPhoneNumber3 = '0735780085';
        final tPhoneNumber4 = '+359 8';
        final tPhoneNumber5 = '+1808080808080808080';

        // Act
        final result1 = inputValidator.stringAsPhoneNumber(tPhoneNumber1);
        final result2 = inputValidator.stringAsPhoneNumber(tPhoneNumber2);
        final result3 = inputValidator.stringAsPhoneNumber(tPhoneNumber3);
        final result4 = inputValidator.stringAsPhoneNumber(tPhoneNumber4);
        final result5 = inputValidator.stringAsPhoneNumber(tPhoneNumber5);

        // Assert
        expect(result1, Left(InvalidInputFailure()));
        expect(result2, Left(InvalidInputFailure()));
        expect(result3, Left(InvalidInputFailure()));
        expect(result4, Left(InvalidInputFailure()));
        expect(result5, Left(InvalidInputFailure()));
      },
    );
  });
}
