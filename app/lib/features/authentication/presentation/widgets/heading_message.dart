import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class HeadingMessage extends StatelessWidget {
  final num height;
  final String heading;
  final String subHeading;
  final TextStyle headingStyle;
  final TextStyle subHeadingStyle;

  const HeadingMessage({
    Key key,
    @required this.height,
    @required this.heading,
    @required this.subHeading,
    this.headingStyle,
    this.subHeadingStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: this.height,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Text(
            this.heading,
            style: headingStyle ?? Theme.of(context).textTheme.headline4,
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 5.0),
          Text(
            this.subHeading,
            style: subHeadingStyle ?? Theme.of(context).textTheme.headline5,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
