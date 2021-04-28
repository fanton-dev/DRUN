import 'package:flutter/material.dart';

class FailureMessage extends StatelessWidget {
  final num height;
  final String message;

  const FailureMessage({
    Key key,
    @required this.height,
    this.message,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: this.message == null ? 0 : 1,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.red,
          ),
          borderRadius: BorderRadius.all(Radius.circular(20)),
          color: Colors.red.withAlpha(50),
        ),
        height: this.height,
        child: Center(
          child: Text(this.message ?? ''),
        ),
      ),
    );
  }
}
