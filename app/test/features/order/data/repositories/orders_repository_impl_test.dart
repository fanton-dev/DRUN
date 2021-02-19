import 'package:DRUN/core/data/sources/network_info.dart';
import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/core/errors/failures.dart';
import 'package:DRUN/features/order/data/models/delivery_order_model.dart';
import 'package:DRUN/features/order/data/repositories/orders_repository_impl.dart';
import 'package:DRUN/features/order/data/sources/orders_local_source.dart';
import 'package:DRUN/features/order/data/sources/orders_remote_source.dart';
import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockOrdersRemoteSource extends Mock implements OrdersRemoteSource {}

class MockOrdersLocalSource extends Mock implements OrdersLocalSource {}

class MockNetworkInfo extends Mock implements NetworkInfo {}

void main() {
  OrdersRepositoryImpl repository;
  MockOrdersRemoteSource mockOrdersRemoteSource;
  MockOrdersLocalSource mockOrdersLocalSource;
  MockNetworkInfo mockNetworkInfo;

  setUp(() {
    mockOrdersRemoteSource = MockOrdersRemoteSource();
    mockOrdersLocalSource = MockOrdersLocalSource();
    mockNetworkInfo = MockNetworkInfo();
    repository = OrdersRepositoryImpl(
      remoteSource: mockOrdersRemoteSource,
      localSource: mockOrdersLocalSource,
      networkInfo: mockNetworkInfo,
    );
  });

  final tLocation = Location(latitude: 42.662388, longitude: 23.373416);
  final tPaymentCardToken = '4ade5874-c573-4c8f-b2b8-7db5fccd983b';
  final tDeliveryOrderModel = DeliveryOrderModel(
    senderUserId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
    senderLocation: Location(latitude: 42.662388, longitude: 23.373416),
    receiverUserId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
    receiverLocation: Location(latitude: 42.652900, longitude: 23.354952),
    paymentCardToken: 'tok_1IMSCX2eZvKYlo2CE3RnWinh',
  );
  final tDeliveryOrderId = '905c801d-c0cc-47db-851e-9b1aaf3adb13';

  group('getPaymentCardToken', () {
    test(
      'should return payment card token string',
      () async {
        // Arrange
        when(
          mockOrdersRemoteSource.getPaymentCardToken(),
        ).thenAnswer((_) async => tPaymentCardToken);

        // Act
        final result = await repository.getPaymentCardToken();

        // Assert
        verify(mockOrdersRemoteSource.getPaymentCardToken());
        verifyZeroInteractions(mockOrdersLocalSource);
        expect(result, Right(tPaymentCardToken));
      },
    );

    test(
      'should return payment card failure when a token cannot be created',
      () async {
        // Arrange
        when(
          mockOrdersRemoteSource.getPaymentCardToken(),
        ).thenThrow(PaymentCardException());

        // Act
        final result = await repository.getPaymentCardToken();

        // Assert
        verify(mockOrdersRemoteSource.getPaymentCardToken());
        verifyZeroInteractions(mockOrdersLocalSource);
        expect(result, Left(PaymentCardFailure()));
      },
    );
  });

  group('getCurrentLocation', () {
    test(
      'should return current device location',
      () async {
        // Arrange
        when(mockOrdersLocalSource.getCurrentLocation())
            .thenAnswer((_) async => tLocation);

        // Act
        final result = await repository.getCurrentLocation();

        // Assert
        verify(mockOrdersLocalSource.getCurrentLocation());
        verifyZeroInteractions(mockOrdersRemoteSource);
        expect(result, Right(tLocation));
      },
    );

    test(
      'should return permission failure when local contacts cannot be loaded',
      () async {
        // Arrange
        when(mockOrdersLocalSource.getCurrentLocation())
            .thenThrow(PermissionException());

        // Act
        final result = await repository.getCurrentLocation();

        // Assert
        verify(mockOrdersLocalSource.getCurrentLocation());
        verifyZeroInteractions(mockOrdersRemoteSource);
        expect(result, Left(PermissionFailure()));
      },
    );
  });

  group('makeDeliveryOrder', () {
    test(
      'should check if device is online',
      () async {
        // Arrange
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);
        when(
          mockOrdersRemoteSource.makeDeliveryOrder(any),
        ).thenAnswer((_) async => tDeliveryOrderId);

        // Act
        await repository.makeDeliveryOrder(tDeliveryOrderModel);

        // Assert
        verify(mockNetworkInfo.isConnected);
      },
    );

    group('device is online', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => true);
      });

      test(
        'should get data from remote source',
        () async {
          // Arrange
          when(
            mockOrdersRemoteSource.makeDeliveryOrder(any),
          ).thenAnswer((_) async => tDeliveryOrderId);

          // Act
          await repository.makeDeliveryOrder(tDeliveryOrderModel);

          // Assert
          verify(mockOrdersRemoteSource.makeDeliveryOrder(any));
        },
      );

      test(
        'should return server failure when the call to remote data source is unsuccessful',
        () async {
          // Arrange
          when(
            mockOrdersRemoteSource.makeDeliveryOrder(any),
          ).thenThrow(ServerException());

          // Act
          final result = await repository.makeDeliveryOrder(
            tDeliveryOrderModel,
          );

          // Assert
          expect(result, Left(ServerFailure()));
        },
      );

      test(
        'should return an order id from remote source',
        () async {
          // Arrange
          when(
            mockOrdersRemoteSource.makeDeliveryOrder(any),
          ).thenAnswer((_) async => tDeliveryOrderId);

          // Act
          final result = await repository.makeDeliveryOrder(
            tDeliveryOrderModel,
          );

          // Assert
          expect(result, Right(tDeliveryOrderId));
        },
      );
    });

    group('device is offline', () {
      setUp(() {
        when(mockNetworkInfo.isConnected).thenAnswer((_) async => false);
      });

      test(
        'should return network failure when there is no internet connection',
        () async {
          // Act
          final result = await repository.makeDeliveryOrder(
            tDeliveryOrderModel,
          );

          // Assert
          verifyZeroInteractions(mockOrdersLocalSource);
          verifyZeroInteractions(mockOrdersRemoteSource);
          expect(result, Left(NetworkFailure()));
        },
      );
    });
  });
}
