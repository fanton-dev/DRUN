import 'package:flutter/material.dart';
import 'package:intl_phone_number_input/intl_phone_number_input.dart';
import 'package:flutter_sim_country_code/flutter_sim_country_code.dart';

import 'package:DRUN/screens/otp.dart';

class PhoneAuthScreen extends StatefulWidget {
  PhoneAuthScreen({Key key}) : super(key: key);

  @override
  _PhoneAuthScreenState createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  bool isValid = false;
  String phoneNumber;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: FlutterSimCountryCode.simCountryCode,
      builder: (BuildContext context, AsyncSnapshot snapshot) {
        Column column;
        if (snapshot.connectionState == ConnectionState.waiting) {
          column = Column(
            children: <Widget>[
              SizedBox(
                child: CircularProgressIndicator(),
                width: 60,
                height: 60,
              ),
              const Padding(
                padding: EdgeInsets.only(top: 16),
                child: Text('Loading...'),
              ),
            ],
          );
        } else {
          column = Column(
            children: <Widget>[
              Padding(
                padding: EdgeInsets.only(bottom: 10),
                child: Text(
                  'Enter your phone number',
                  style: TextStyle(
                      fontSize: 28, color: Theme.of(context).primaryColor),
                ),
              ),
              Padding(
                padding: EdgeInsets.only(bottom: 30),
                child: Text(
                  'We will send you a SMS with a verification code',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.normal,
                    color: Colors.grey,
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.only(bottom: 0),
                child: InternationalPhoneNumberInput(
                  onInputChanged: (PhoneNumber phoneNumber) =>
                      this.phoneNumber = phoneNumber.toString(),
                  onInputValidated: (bool isValid) => this.isValid = isValid,
                  ignoreBlank: true,
                  autoValidate: true,
                  initialCountry2LetterCode: snapshot.data,
                ),
              ),
              Container(
                padding: EdgeInsets.all(16),
                width: MediaQuery.of(context).size.width,
                margin: const EdgeInsets.only(left: 70.0, right: 70.0),
                alignment: Alignment.center,
                child: new Row(
                  children: <Widget>[
                    new Expanded(
                      child: new FlatButton(
                        shape: new RoundedRectangleBorder(
                            borderRadius: new BorderRadius.circular(30.0)),
                        color: !isValid
                            ? Theme.of(context).primaryColor.withOpacity(0.6)
                            : Theme.of(context).primaryColor,
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => OTPScreen(
                              phoneNumber: phoneNumber,
                            ),
                          ),
                        ),
                        child: new Container(
                          padding: const EdgeInsets.symmetric(
                            vertical: 20.0,
                            horizontal: 20.0,
                          ),
                          child: Text(
                            !isValid ? "Enter a phone number" : "Continue",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        }
        return new Scaffold(
          backgroundColor: Colors.white,
          body: Center(
            child: Padding(
              padding: EdgeInsets.only(top: 60, right: 40, left: 40),
              child: Container(
                height: MediaQuery.of(context).size.height,
                child: column,
              ),
            ),
          ),
        );
      },
    );
  }
}
