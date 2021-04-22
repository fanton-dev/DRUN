import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

import '../../../../core/presentation/widgets/widgets.dart';
import '../widgets/widgets.dart';

class CodeInputPage extends StatelessWidget {
  final String phoneNumber;
  final String error;

  const CodeInputPage({
    Key key,
    @required this.phoneNumber,
    this.error,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            HeadingMessage(
              height: MediaQuery.of(context).size.height / 4,
              heading: 'We\'ve sent you a code',
              subHeading:
                  'You should receive an authentication SMS shortly on $phoneNumber. Input the code from it below.',
            ),
            SizedBox(height: 10.0),
            FailureMessage(
              height: MediaQuery.of(context).size.height / 16,
              message: error,
            ),
            SizedBox(height: 20.0),
            CodeInputForm(phoneNumber: this.phoneNumber),
          ],
        ),
      ),
    );
  }
}
