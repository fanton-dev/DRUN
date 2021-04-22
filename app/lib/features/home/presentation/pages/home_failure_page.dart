import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

import '../../../../core/presentation/widgets/widgets.dart';

class HomeFailurePage extends StatelessWidget {
  final String error;
  const HomeFailurePage({Key key, @required this.error}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: FailureMessage(
              height: MediaQuery.of(context).size.height / 16,
              message: error,
            ),
          ),
        ),
      ],
    );
  }
}
