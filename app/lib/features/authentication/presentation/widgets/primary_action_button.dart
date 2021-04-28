import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

class PrimaryActionButton extends StatelessWidget {
  final String text;
  final Function call;

  const PrimaryActionButton({
    Key key,
    @required this.text,
    @required this.call,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: RaisedButton(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        color: Theme.of(context).primaryColor,
        disabledColor: Theme.of(context).primaryColor.withOpacity(0.3),
        onPressed: this.call,
        child: Container(
          padding: const EdgeInsets.all(20.0),
          child: Text(
            text,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headline6,
          ),
        ),
      ),
    );
  }
}
