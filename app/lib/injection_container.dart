import 'package:contacts_service/contacts_service.dart';
import 'package:data_connection_checker/data_connection_checker.dart';
import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;
import 'package:location/location.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stripe_payment/stripe_payment.dart';

import 'core/data/sources/network_info.dart';
import 'core/presentation/util/input_validator.dart';
import 'features/authentication/data/repositories/user_authentication_repository_impl.dart';
import 'features/authentication/data/sources/user_authentication_local_source.dart';
import 'features/authentication/data/sources/user_authentication_remote_source.dart';
import 'features/authentication/domain/repositories/user_authentication_repository.dart';
import 'features/authentication/domain/usecases/get_logged_in_user.dart';
import 'features/authentication/domain/usecases/send_authentication_sms.dart';
import 'features/authentication/domain/usecases/verify_authentication_sms.dart';
import 'features/authentication/presentation/bloc/authentication_bloc.dart';
import 'features/home/data/repository/contacts_repository_impl.dart';
import 'features/home/data/sources/contacts_local_source.dart';
import 'features/home/data/sources/contacts_remote_source.dart';
import 'features/home/domain/repositories/contacts_repository.dart';
import 'features/home/domain/usecases/get_contacts.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'features/order/presentation/bloc/order_bloc.dart';
import 'features/order/data/repositories/orders_repository_impl.dart';
import 'features/order/data/sources/orders_local_source.dart';
import 'features/order/data/sources/orders_remote_source.dart';
import 'features/order/domain/repositories/orders_repository.dart';
import 'features/order/domain/usecases/get_current_location_coordinates.dart';
import 'features/order/domain/usecases/get_payment_card_token.dart';
import 'features/order/domain/usecases/make_delivery_order.dart';

// Service locator
final sl = GetIt.instance;

Future<void> init() async {
  //! Features
  //* Authentication feature
  await initAuthentication();

  //* Home feature
  await initHome();

  //* Order feature
  await initOrder();

  //! Core
  await initCore();

  //! External dependencies
  await initExternalDependencies();
}

Future<void> initAuthentication() async {
  // Presentation Bloc
  sl.registerFactory(
    () => AuthenticationBloc(
      getLoggedInUser: sl(),
      sendAuthenticationSms: sl(),
      verifyAuthenticationSms: sl(),
      inputValidator: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => GetLoggedInUser(sl()));
  sl.registerLazySingleton(() => SendAuthenticationSms(sl()));
  sl.registerLazySingleton(() => VerifyAuthenticationSms(sl()));

  // Repository
  sl.registerLazySingleton<UserAuthenticationRepository>(
    () => UserAuthenticationRepositoryImpl(
      remoteSource: sl(),
      localSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Data sources
  sl.registerLazySingleton<UserAuthenticationRemoteSource>(
    () => UserAuthenticationRemoteSourceImpl(httpClient: sl()),
  );

  sl.registerLazySingleton<UserAuthenticationLocalSource>(
    () => UserAuthenticationLocalSourceImpl(sharedPreferences: sl()),
  );
}

Future<void> initHome() async {
  // Presentation Bloc
  sl.registerFactory(
    () => HomeBloc(
      getContacts: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => GetContacts(sl()));

  // Repository
  sl.registerLazySingleton<ContactsRepository>(
    () => ContactsRepositoryImpl(
      remoteSource: sl(),
      localSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Data sources
  sl.registerLazySingleton<ContactsRemoteSource>(
    () => ContactsRemoteSourceImpl(httpClient: sl()),
  );

  sl.registerLazySingleton<ContactsLocalSource>(
    () => ContactsLocalSourceImpl(
      permissionHandler: sl(),
      getContacts: sl(),
    ),
  );
}

Future<void> initOrder() async {
  // Presentation Bloc
  sl.registerFactory(
    () => OrderBloc(
      getCurrentLocationCoordinates: sl(),
      getPaymentCardToken: sl(),
    ),
  );

  // Use cases
  sl.registerLazySingleton(() => GetCurrentLocationCoordinates(sl()));
  sl.registerLazySingleton(() => GetPaymentCardToken(sl()));
  sl.registerLazySingleton(() => MakeDeliveryOrder(sl()));
}

Future<void> initCore() async {
  // Data sources
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));

  // Presentation utils
  sl.registerLazySingleton(() => InputValidator());

  // Repository
  sl.registerLazySingleton<OrdersRepository>(
    () => OrdersRepositoryImpl(
      remoteSource: sl(),
      localSource: sl(),
      networkInfo: sl(),
    ),
  );

  // Data sources
  sl.registerLazySingleton<OrdersRemoteSource>(
    () => OrdersRemoteSourceImpl(
      paymentRequestWithCardForm: sl(),
    ),
  );

  sl.registerLazySingleton<OrdersLocalSource>(
    () => OrdersLocalSourceImpl(
      location: sl(),
    ),
  );
}

Future<void> initExternalDependencies() async {
  // Data Connection Checker
  sl.registerLazySingleton(() => DataConnectionChecker());

  // HTTP Client
  sl.registerLazySingleton(() => http.Client());

  // Shared preferences
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);

  // PermissionStatus
  sl.registerLazySingleton(() => PermissionHandler());

  // ContactsService -> getContacts
  Future<Iterable<Contact>> getContacts() => ContactsService.getContacts();
  sl.registerLazySingleton(() => getContacts);

  // Stripe -> paymentRequestWithCardForm
  Future<PaymentMethod> paymentRequestWithCardForm() =>
      StripePayment.paymentRequestWithCardForm(CardFormPaymentRequest());
  sl.registerLazySingleton(() => paymentRequestWithCardForm);

  // Location
  sl.registerLazySingleton(() => Location());
}
