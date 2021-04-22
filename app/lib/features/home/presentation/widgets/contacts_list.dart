import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:meta/meta.dart';

import '../../../authentication/domain/entities/user_credentials.dart';
import '../../domain/entities/complete_contact.dart';
import '../bloc/home_bloc.dart';

class ContactsList extends StatelessWidget {
  const ContactsList({
    Key key,
    @required this.contacts,
    @required this.userCredentials,
  }) : super(key: key);

  final List<CompleteContact> contacts;
  final UserCredentials userCredentials;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: ListView.builder(
        itemCount: contacts?.length ?? 0,
        itemBuilder: (BuildContext context, int index) {
          CompleteContact contact = this.contacts?.elementAt(index);
          return ListTile(
            contentPadding:
                const EdgeInsets.symmetric(vertical: 2, horizontal: 18),
            title: Text(contact.name ?? ''),
            leading: CircleAvatar(
              child: Text(contact.name[0]),
              backgroundColor: Theme.of(context).accentColor,
            ),
            onTap: () => BlocProvider.of<HomeBloc>(context).add(
              HomeContactSelectedEvent(
                this.userCredentials,
                this.contacts,
                contact.userId,
              ),
            ),
          );
        },
      ),
    );
  }
}
