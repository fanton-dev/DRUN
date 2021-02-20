import 'package:flutter/material.dart';

import '../widgets/widgets.dart';

class PhoneInputPage extends StatelessWidget {
  final String error;
  const PhoneInputPage({Key key, this.error}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          children: [
            HeadingMessage(
              height: MediaQuery.of(context).size.height / 4,
              heading: 'Enter your phone number',
              subHeading: 'We will send you a SMS with an authentication code',
            ),
            SizedBox(height: 10.0),
            FailureMessage(
              height: MediaQuery.of(context).size.height / 16,
              message: error,
            ),
            SizedBox(height: 20.0),
            PhoneInputForm(),
          ],
        ),
      ),
    );
  }
}
