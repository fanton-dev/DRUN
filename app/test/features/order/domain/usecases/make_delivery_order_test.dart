import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:DRUN/features/order/domain/entities/delivery_order.dart';
import 'package:DRUN/features/order/domain/repositories/orders_repository.dart';
import 'package:DRUN/features/order/domain/usecases/make_delivery_order.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockOrderRepository extends Mock implements OrdersRepository {}

void main() {
  MakeDeliveryOrder usecase;
  MockOrderRepository mockOrderRepository;

  setUp(() {
    mockOrderRepository = MockOrderRepository();
    usecase = MakeDeliveryOrder(ordersRepository: mockOrderRepository);
  });

  final tDeliveryOrder = DeliveryOrder(
    senderUserId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
    senderLocation: Location(latitude: 42.662388, longitude: 23.373416),
    receiverUserId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
    receiverLocation: Location(latitude: 42.652900, longitude: 23.354952),
    paymentCardToken: 'tok_1IMSCX2eZvKYlo2CE3RnWinh',
  );

  final tDeliveryOrderId = '905c801d-c0cc-47db-851e-9b1aaf3adb13';

  test(
    'should make delivery order request to the repository',
    () async {
      // Arrange
      when(
        mockOrderRepository.makeDeliveryOrder(any),
      ).thenAnswer((_) async => Right(tDeliveryOrderId));

      // Act
      final result = await usecase(DeliveryOrderParams(order: tDeliveryOrder));

      // Assert
      expect(result, Right(tDeliveryOrderId));
      verify(
        mockOrderRepository.makeDeliveryOrder(tDeliveryOrder),
      );
      verifyNoMoreInteractions(mockOrderRepository);
    },
  );
}
