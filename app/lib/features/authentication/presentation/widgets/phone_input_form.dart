import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_sim_country_code/flutter_sim_country_code.dart';
import 'package:intl_phone_number_input/intl_phone_number_input.dart';

import 'widgets.dart';
import '../bloc/authentication_bloc.dart';

class PhoneInputForm extends StatefulWidget {
  const PhoneInputForm({
    Key key,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() => _PhoneInputFormState();
}

class _PhoneInputFormState extends State<PhoneInputForm> {
  bool isValidPhoneNumber;
  String phoneNumber;

  @override
  void initState() {
    isValidPhoneNumber = false;
    super.initState();
  }

  void _setPhoneNumber(String state) {
    setState(() {
      phoneNumber = state;
    });
  }

  void _setIsValidPhoneNumber(bool state) {
    setState(() {
      isValidPhoneNumber = state;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          FutureBuilder(
            future: FlutterSimCountryCode.simCountryCode,
            builder: (BuildContext context, AsyncSnapshot isoCodeSnapshot) {
              return Container(
                child: InternationalPhoneNumberInput(
                  selectorConfig: SelectorConfig(
                    selectorType: PhoneInputSelectorType.BOTTOM_SHEET,
                    useEmoji: true,
                  ),
                  onInputChanged: (PhoneNumber phoneNumber) {
                    _setPhoneNumber(phoneNumber.toString());
                  },
                  onInputValidated: (bool isValid) => _setIsValidPhoneNumber(
                    isValid,
                  ),
                  initialValue: PhoneNumber(
                    isoCode: isoCodeSnapshot.data ?? 'BG',
                  ),
                ),
              );
            },
          ),
          SizedBox(height: 10.0),
          PrimaryActionButton(
            text: isValidPhoneNumber ? 'Continue' : 'Invalid number',
            call: isValidPhoneNumber
                ? () => BlocProvider.of<AuthenticationBloc>(context)
                    .add(SendAuthenticationSmsEvent(this.phoneNumber))
                : null,
          ),
        ],
      ),
    );
  }
}
