import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HomeScreen extends StatelessWidget {
  final FirebaseUser user;
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  HomeScreen({Key key, @required this.user})
      : assert(user != null),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(child: Container());
  }
}
