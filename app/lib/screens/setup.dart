import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import 'package:DRUN/screens/phone_auth.dart';

class SetupScreen extends StatefulWidget {
  @override
  _SetupScreenState createState() => new _SetupScreenState();
}

class _SetupScreenState extends State<SetupScreen>
    with TickerProviderStateMixin {
  VideoPlayerController _videoController;

  @override
  void initState() {
    super.initState();
    _videoController =
        VideoPlayerController.asset('assets/setup_background.mp4')
          ..initialize().then(
            (_) {
              setState(() {
                _videoController.play();
                _videoController.setLooping(true);
              });
            },
          );
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: new Stack(
        children: <Widget>[
          Container(
            child: SizedBox.expand(
              child: FittedBox(
                fit: BoxFit.cover,
                child: SizedBox(
                  width: _videoController.value.size?.width ?? 0,
                  height: _videoController.value.size?.height ?? 0,
                  child: VideoPlayer(_videoController),
                ),
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.7),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: FractionalOffset.topCenter,
                end: FractionalOffset.bottomCenter,
                colors: [
                  Colors.black.withOpacity(0.5),
                  Colors.grey.withOpacity(0.0),
                  Colors.black.withOpacity(0.5),
                ],
                stops: [0.0, 0.5, 1.0],
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.only(top: 150.0),
            child: Column(
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(top: 20.0),
                  child: new Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(
                        "DRUN",
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 100.0,
                            fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "Delivery, but with drones",
                        style: TextStyle(
                            color: Colors.white70,
                            fontSize: 25.0,
                            fontWeight: FontWeight.normal),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.only(top: 120.0),
                  width: MediaQuery.of(context).size.width,
                  margin: const EdgeInsets.only(left: 70.0, right: 70.0),
                  alignment: Alignment.center,
                  child: new Row(
                    children: <Widget>[
                      new Expanded(
                        child: new FlatButton(
                          shape: new RoundedRectangleBorder(
                              borderRadius: new BorderRadius.circular(30.0)),
                          color: Colors.white,
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => PhoneAuthScreen(),
                            ),
                          ),
                          child: new Container(
                            padding: const EdgeInsets.symmetric(
                              vertical: 20.0,
                              horizontal: 20.0,
                            ),
                            child: new Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                new Expanded(
                                  child: Text(
                                    "Continue",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        color: Theme.of(context).primaryColor,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _videoController.dispose();
  }
}
