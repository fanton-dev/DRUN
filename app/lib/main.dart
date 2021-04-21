import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'features/authentication/domain/entities/user_credentials.dart';
import 'features/authentication/presentation/bloc/authentication_bloc.dart';
import 'features/authentication/presentation/pages/pages.dart';
import 'features/home/presentation/pages/pages.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
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
        child: Scaffold(body: buildAuthentication(context)),
      ),
    );
  }
}

BlocProvider<AuthenticationBloc> buildAuthentication(BuildContext context) {
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
          return buildHome(state.userCredentials);
        }

        return Placeholder();
      },
    ),
  );
}

BlocProvider<HomeBloc> buildHome(UserCredentials userCredentials) {
  return BlocProvider(
    create: (_) => sl<HomeBloc>(),
    child: BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        print(state);
        if (state is HomeInitialState) {
          BlocProvider.of<HomeBloc>(context)
              .add(GetContactsEvent(userCredentials));
        } else if (state is HomeAuthenticatedState) {
          print(state.contacts);
          return HomePage();
        } else if (state is HomeFailureState) {
          return Placeholder();
        } else if (state is HomeContactSelectedState) {
          return Placeholder();
        }

        return Placeholder();
      },
    ),
  );
}
