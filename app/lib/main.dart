import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'package:DRUN/screens/setup.dart';
import 'package:DRUN/screens/home.dart';

void main() => runApp(DRUN());

class DRUN extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DRUN',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        accentColor: Colors.indigoAccent,
      ),
      home: App(),
    );
  }
}

class App extends StatefulWidget {
  App({Key key}) : super(key: key);

  @override
  _AppState createState() => _AppState();
}

class _AppState extends State<App> {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  FirebaseUser user;

  @override
  void initState() {
    super.initState();
    getCurrentUser();
  }

  Future<FirebaseUser> getCurrentUser() async {
    FirebaseUser _user = await _firebaseAuth.currentUser();
    return _user;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: getCurrentUser(),
      builder: (context, AsyncSnapshot<FirebaseUser> userSnapshot) {
        if (userSnapshot.hasData) {
          return HomeScreen(
            user: userSnapshot.data,
          );
        } else {
          return SetupScreen();
        }
      },
    );
  }
}
