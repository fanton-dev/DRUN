import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

import '../../../authentication/domain/entities/user_credentials.dart';
import '../../domain/entities/complete_contact.dart';
import '../widgets/widgets.dart';

class HomePage extends StatelessWidget {
  final UserCredentials userCredentials;
  final List<CompleteContact> contacts;

  const HomePage({
    Key key,
    @required this.userCredentials,
    @required this.contacts,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DRUN'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Settings',
            onPressed: () {},
          ),
        ],
      ),
      body: ContactsList(contacts: contacts, userCredentials: userCredentials),
    );
  }
}
