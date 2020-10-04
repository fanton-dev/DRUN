import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:contacts_service/contacts_service.dart';

class MessagesScreen extends StatelessWidget {
  final FirebaseUser user;
  final Contact peer;

  MessagesScreen({Key key, @required this.user, @required this.peer})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'CHAT',
          // style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: ChatScreen(
        user: user,
        peer: peer,
      ),
    );
  }
}


class ChatScreen extends StatefulWidget {
  final FirebaseUser user;
  final Contact peer;

  ChatScreen({Key key, @required this.user, this.peer})
      : assert(user != null, peer != null),
        super(key: key);


  @override
  State createState() =>
      _ChatScreenState(user: user, peer: peer);
}

class _ChatScreenState extends State<ChatScreen> {
  final FirebaseUser user;
  final Contact peer;
  String peerId;
  String groupChatId;

  List<DocumentSnapshot> listMessage = new List.from([]);
  int _limit = 20;
  final int _limitIncrement = 20;

  final TextEditingController textEditingController = TextEditingController();
  final ScrollController listScrollController = ScrollController();
  final FocusNode focusNode = FocusNode();

  _scrollListener() {
    if (listScrollController.offset >=
        listScrollController.position.maxScrollExtent &&
        !listScrollController.position.outOfRange) {
      print("reach the bottom");
      setState(() {
        print("reach the bottom");
        _limit += _limitIncrement;
      });
    }
    if (listScrollController.offset <=
        listScrollController.position.minScrollExtent &&
        !listScrollController.position.outOfRange) {
      print("reach the top");
      setState(() {
        print("reach the top");
      });
    }
  }

  @override
  void initState() async {
    super.initState();
    // focusNode.addListener(onFocusChange);
    listScrollController.addListener(_scrollListener);

    Firestore.instance.collection('users').getDocuments().then((QuerySnapshot snapshot) => {
      snapshot.documents.forEach((storageContact) {
        String currentPhoneNumber = peer.phones.first.value;
        String storageNumber = storageContact.data['phone'].toString();


        if (currentPhoneNumber[0] == "+") {
          currentPhoneNumber = currentPhoneNumber.substring(4);
        } else {
          currentPhoneNumber = currentPhoneNumber.substring(1);
        }

        if (currentPhoneNumber.replaceAll(new RegExp(r"\s+"), "") == storageNumber.substring(4)) {
          peerId = storageContact.data['uid'].toString();
          groupChatId = peerId;
          return;
        }
      })
    }).then((value) => setState(() {}));
  }

  _ChatScreenState({this.user, this.peer})
      : assert(user != null, peer != null),
        super() ;

  final CollectionReference messages =
      Firestore.instance.collection('messages');

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        children: <Widget>[
          Column(
            children: <Widget>[
              // List of messages
              buildListMessage(),

              // Input content
              buildInput(),
            ],
          ),
        ],
      ),
    );
  }

  void onSendMessage(String content, int type) {
    // type: 0 = text, 1 = image, 2 = sticker
    if (content.trim() != '') {
      textEditingController.clear();

      var documentReference = Firestore.instance
          .collection('messages')
          .document(groupChatId)
          .collection(groupChatId)
          .document(DateTime.now().millisecondsSinceEpoch.toString());

      Firestore.instance.runTransaction((transaction) async {
        transaction.set(
          documentReference,
          {
            'idFrom': user.uid,
            'idTo': peerId,
            'timestamp': DateTime.now().millisecondsSinceEpoch.toString(),
            'content': content,
            'type': type
          },
        );
      });
      listScrollController.animateTo(0.0,
          duration: Duration(milliseconds: 300), curve: Curves.easeOut);
    } else {
      Fluttertoast.showToast(
          msg: 'Nothing to send',
          backgroundColor: Colors.black,
          textColor: Colors.red);
    }
  }

  Widget buildInput() {
    return Container(
      child: Row(
        children: <Widget>[
          // Edit text
          Flexible(
            child: Container(
              child: TextField(
                onSubmitted: (value) {
                  onSendMessage(textEditingController.text, 0);
                },
                style: TextStyle(fontSize: 15.0),
                controller: textEditingController,
                decoration: InputDecoration.collapsed(
                  hintText: 'Type your message...',
                  hintStyle: TextStyle(color: Colors.grey),
                ),
                focusNode: focusNode,
              ),
            ),
          ),

          // Button send message
          Material(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 8.0),
              child: IconButton(
                icon: Icon(Icons.send),
                onPressed: () => onSendMessage(textEditingController.text, 0),
              ),
            ),
            color: Colors.white,
          ),
        ],
      ),
      width: double.infinity,
      height: 50.0,
      decoration: BoxDecoration(
          border: Border(top: BorderSide(color: Colors.grey, width: 0.5)),
          color: Colors.white),
    );
  }

  Widget buildListMessage() {
    return Flexible(
      child: groupChatId == ''
          ? Center(
          child: CircularProgressIndicator())
          : StreamBuilder(
        stream: Firestore.instance
            .collection('messages')
            .document(groupChatId)
            .collection(groupChatId)
            .orderBy('timestamp', descending: true)
            .limit(_limit)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          } else {
            listMessage.addAll(snapshot.data.documents);
            return ListView.builder(
              padding: EdgeInsets.all(10.0),
              itemBuilder: (context, index) =>
                  buildItem(index, snapshot.data.documents[index]),
              itemCount: snapshot.data.documents.length,
              reverse: true,
              controller: listScrollController,
            );
          }
        },
      ),
    );
  }


  Widget buildItem(int index, DocumentSnapshot document) {
    if (document.data['idFrom'] == user.uid) {
      // Right (my message)
      return Row(
        children: <Widget>[
          // Text
              Container(
            child: Text(
              document.data['content'],
            ),
            padding: EdgeInsets.fromLTRB(15.0, 10.0, 15.0, 10.0),
            width: 200.0,
            decoration: BoxDecoration(
                color: Colors.grey,
                borderRadius: BorderRadius.circular(8.0)),
            margin: EdgeInsets.only(
                bottom: isLastMessageRight(index) ? 20.0 : 10.0,
                right: 10.0),
          )
        ],
        mainAxisAlignment: MainAxisAlignment.end,
      );
    } else {
      // Left (peer message)
      return Container(
        child: Column(
          children: <Widget>[
            Row(
              children: <Widget>[
                Container(
                  child: Text(
                    document.data['content'],
                    style: TextStyle(color: Colors.white),
                  ),
                  padding: EdgeInsets.fromLTRB(15.0, 10.0, 15.0, 10.0),
                  width: 200.0,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8.0)),
                  margin: EdgeInsets.only(left: 10.0),
                )
              ],
            ),
          ],
          crossAxisAlignment: CrossAxisAlignment.start,
        ),
        margin: EdgeInsets.only(bottom: 10.0),
      );
    }
  }

  bool isLastMessageLeft(int index) {
    if ((index > 0 &&
        listMessage != null &&
        listMessage[index - 1].data['idFrom'] == user.uid) ||
        index == 0) {
      return true;
    } else {
      return false;
    }
  }

  bool isLastMessageRight(int index) {
    if ((index > 0 &&
        listMessage != null &&
        listMessage[index - 1].data['idFrom'] != user.uid) ||
        index == 0) {
      return true;
    } else {
      return false;
    }
  }
}
