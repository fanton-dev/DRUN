import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'features/authentication/presentation/bloc/authentication_bloc.dart';
import 'features/authentication/presentation/pages/pages.dart';
import 'injection_container.dart' as di;
import 'injection_container.dart';
import 'theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    debugPaintSizeEnabled = false;
    return MaterialApp(
      title: 'DRUN',
      theme: buildLightThemeData(),
      darkTheme: buildDarkThemeData(),
      themeMode: ThemeMode.system,
      home: SafeArea(
        child: Scaffold(body: buildBody(context)),
      ),
    );
  }
}

BlocProvider<AuthenticationBloc> buildBody(BuildContext context) {
  return BlocProvider(
    create: (_) => sl<AuthenticationBloc>(),
    child: BlocBuilder<AuthenticationBloc, AuthenticationState>(
      builder: (context, state) {
        if (state is AuthenticationInitialState) {
          return InitialPage();
        } else if (state is AuthenticationLoadingState) {
          return LoadingPage();
        } else if (state is AuthenticationPhoneInputState) {
          return PhoneInputPage();
        } else if (state is AuthenticationPhoneInputErrorState) {
          return PhoneInputPage(error: state.message);
        } else if (state is AuthenticationCodeInputState) {
          return CodeInputPage(
            phoneNumber: state.authenticationSmsStatus.phoneNumber,
          );
        } else if (state is AuthenticationCodeInputErrorState) {
          return CodeInputPage(
            phoneNumber: state.phoneNumber,
            error: state.message,
          );
        } else if (state is AuthenticationSuccessfulState) {
          return Placeholder();
        } else {
          return Placeholder();
        }
      },
    ),
  );
}
