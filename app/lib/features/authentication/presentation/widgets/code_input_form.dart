import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:meta/meta.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

import '../bloc/authentication_bloc.dart';
import 'widgets.dart';

class CodeInputForm extends StatefulWidget {
  final String phoneNumber;

  CodeInputForm({
    Key key,
    @required this.phoneNumber,
  }) : super(key: key);

  @override
  _CodeInputFormState createState() =>
      _CodeInputFormState(phoneNumber: this.phoneNumber);
}

class _CodeInputFormState extends State<CodeInputForm> {
  final String phoneNumber;
  bool isValidCode;
  String code;

  _CodeInputFormState({
    @required this.phoneNumber,
  });

  @override
  void initState() {
    isValidCode = false;
    super.initState();
  }

  void _setCode(String state) {
    setState(() {
      code = state;
    });
  }

  void _setIsValidCode(bool state) {
    setState(() {
      isValidCode = state;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          child: Padding(
            padding: const EdgeInsets.only(left: 25.0, right: 25.0),
            child: PinCodeTextField(
              appContext: context,
              length: 6,
              obscureText: false,
              keyboardType: TextInputType.number,
              animationType: AnimationType.fade,
              pinTheme: PinTheme(
                activeColor: Theme.of(context).primaryColor,
                selectedColor: Theme.of(context).accentColor,
                shape: PinCodeFieldShape.box,
                borderRadius: BorderRadius.circular(5),
                fieldHeight: 50,
                fieldWidth: 40,
              ),
              animationDuration: Duration(milliseconds: 150),
              backgroundColor: Colors.transparent,
              enableActiveFill: false,
              textStyle: Theme.of(context).textTheme.headline4,
              onChanged: (code) {
                _setIsValidCode(code.length == 6);
                _setCode(code);
              },
            ),
          ),
        ),
        SizedBox(height: 10.0),
        PrimaryActionButton(
          text: isValidCode ? 'Continue' : 'Invalid code',
          call: isValidCode
              ? () => BlocProvider.of<AuthenticationBloc>(context).add(
                  VerifyAuthenticationSmsEvent(this.phoneNumber, this.code))
              : null,
        ),
      ],
    );
  }
}
