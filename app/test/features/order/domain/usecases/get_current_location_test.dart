import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:DRUN/features/order/domain/repositories/orders_repository.dart';
import 'package:DRUN/features/order/domain/usecases/get_current_location.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockOrderRepository extends Mock implements OrdersRepository {}

void main() {
  GetCurrentLocation usecase;
  MockOrderRepository mockOrderRepository;

  setUp(() {
    mockOrderRepository = MockOrderRepository();
    usecase = GetCurrentLocation(ordersRepository: mockOrderRepository);
  });

  final tLocation = Location(latitude: 42.662388, longitude: 23.373416);

  test(
    'should get current location from the repository',
    () async {
      // Arrange
      when(
        mockOrderRepository.getCurrentLocation(),
      ).thenAnswer((_) async => Right(tLocation));

      // Act
      final result = await usecase(NoParams());

      // Assert
      expect(result, Right(tLocation));
      verify(
        mockOrderRepository.getCurrentLocation(),
      );
      verifyNoMoreInteractions(mockOrderRepository);
    },
  );
}
