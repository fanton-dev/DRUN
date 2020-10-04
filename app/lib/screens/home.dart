import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:contacts_service/contacts_service.dart';
import 'package:permission_handler/permission_handler.dart';

class HomeScreen extends StatefulWidget {
  final FirebaseUser user;

  HomeScreen({Key key, @required this.user})
      : assert(user != null),
        super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState(user);
}

class _HomeScreenState extends State<HomeScreen> {
  Iterable<Contact> _contacts;
  PermissionStatus _permissionStatus;
  final FirebaseUser user;

  _HomeScreenState(this.user)
      : assert(user != null),
        super();

  @override
  void initState() {
    getPermission();
    getContacts();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    if (_permissionStatus == PermissionStatus.denied) {
      _permissionNotGrantedScreen(context);
    }

    return Scaffold(
      appBar: AppBar(
        title: (Text('Contacts')),
      ),
      body: _contacts != null
          ? _contactsScreen()
          : Center(child: const CircularProgressIndicator()),
    );
  }

  Widget _contactsScreen() {
    return ListView.builder(
      itemCount: _contacts?.length ?? 0,
      itemBuilder: (BuildContext context, int index) {
        Contact contact = _contacts?.elementAt(index);
        return ListTile(
          contentPadding:
              const EdgeInsets.symmetric(vertical: 2, horizontal: 18),
          leading: (contact.avatar != null && contact.avatar.isNotEmpty)
              ? CircleAvatar(
                  backgroundImage: MemoryImage(contact.avatar),
                )
              : CircleAvatar(
                  child: Text(contact.initials()),
                  backgroundColor: Theme.of(context).accentColor,
                ),
          title: Text(contact.displayName ?? ''),
          //This can be further expanded to showing contacts detail
          // onPressed().
        );
      },
    );
  }

  Future<void> getPermission() async {
    final PermissionStatus permission = await Permission.contacts.status;
    if (permission != PermissionStatus.granted &&
        permission != PermissionStatus.denied) {
      final Map<Permission, PermissionStatus> permissionStatus =
          await [Permission.contacts].request();
      return permissionStatus[Permission.contacts] ??
          PermissionStatus.undetermined;
    } else {
      setState(() {
        _permissionStatus = permission;
      });
    }
  }

  Future<void> getContacts() async {
    List<String> contactNumbers = [];
    Iterable<Contact> contacts = await ContactsService.getContacts();
    await Firestore.instance.collection('users').getDocuments().then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((contact) {
        final String number = contact.data['phone'].toString();
        contactNumbers.add(number.substring(4));
      })
    });

    contacts = contacts.where((contact) {
            try {
              String contactPhoneNumber;
              if (contact.phones.first.value[0] == '0') {
                contactPhoneNumber = contact.phones.first.value.substring(1);
              } else {
                if (contact.phones.first.value[0] == '+') {
                  contactPhoneNumber = contact.phones.first.value.substring(4);
                } else {
                  return false;
                }
              }

              contactPhoneNumber =
                  contactPhoneNumber.replaceAll(new RegExp(r"\s+"), "");

              return contactNumbers.contains(contactPhoneNumber);
            } catch(ex) {
              return false;
            }
            }

    );


    setState(() {
      _contacts = contacts;
    });
  }

  void _permissionNotGrantedScreen(BuildContext context) {
    showDialog(
        context: context,
        builder: (BuildContext context) => AlertDialog(
              title: Text('Permissions error'),
              content: Text('Please enable contacts access '
                  'permission in system settings'),
              actions: <Widget>[
                RaisedButton(
                  child: Text('OK'),
                  onPressed: () => Navigator.of(context).pop(),
                )
              ],
            ));
  }
}
