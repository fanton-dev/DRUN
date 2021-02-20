import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/authentication_bloc.dart';
import '../widgets/widgets.dart';

class InitialPage extends StatelessWidget {
  const InitialPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    BlocProvider.of<AuthenticationBloc>(context).add(GetLoggedInUserEvent());

    return Container(
      child: Column(
        children: <Widget>[
          HeadingMessage(
            height: MediaQuery.of(context).size.height / 2,
            heading: 'DRUN',
            subHeading:
                'What sound does the drone make when it hits the window?',
            headingStyle: Theme.of(context).textTheme.headline1,
            subHeadingStyle: Theme.of(context).textTheme.headline2,
          ),
          PrimaryActionButton(
            text: 'Continue',
            call: () => BlocProvider.of<AuthenticationBloc>(context)
                .add(StartAuthenticationEvent()),
          )
        ],
      ),
    );
  }
}
