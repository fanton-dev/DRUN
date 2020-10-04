import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';


class MessagesScreen extends StatelessWidget {
  final FirebaseUser user;

  MessagesScreen({Key key, @required this.user})
      : assert(user != null),
        super(key: key);

  final CollectionReference messages =
      Firestore.instance.collection('messages');

  @override
  Widget build(BuildContext context) {
    
    return Scaffold(

      appBar: AppBar(
        actions: [
          SingleChildScrollView(
              child: Column(
              
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CircleAvatar(
                    backgroundColor: Colors.brown.shade800,
                    child: Image.asset("assets/profile.png")),
                Text('Georgi Popov'),
                Image.asset("assets/Online.png")
              ],
            ),
          )
        ],
      ),   
      body: Container(
        child: SingleChildScrollView
        (
        
          
          child: StreamBuilder(
            
          stream: Firestore.instance.collection('users').snapshots(),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              );
            } else {
              return ListView.builder(
                padding: EdgeInsets.all(10.0),
                itemBuilder: (context, index) =>
                    buildItem(context, snapshot.data.documents[index]),
                itemCount: snapshot.data.documents.length,
              );
            }
          },
        ),
      ),
    )
      

      /*FutureBuilder<QuerySnapshot>(
                  future: messages.getDocuments(),
                  builder: (context, snapshot) {
                    if (snapshot.hasError) {
                      return Text('Something went wrong');
                    }
          
                    if (snapshot.connectionState == ConnectionState.done) {
                      return new ListView(
                        children: snapshot.data.documents
                            .map((DocumentSnapshot documentSnapshot) {
                          return new ListTile(
                            title: new Text(documentSnapshot.data['message']),
                          );
                        }).toList(),
                      );
                    }
                    return Text('Loading');
                  },
                )*/
    );
  }

  buildItem(BuildContext context, document) {
    return Container( 
      child: Text(document.toString()),
    );
  }
}
