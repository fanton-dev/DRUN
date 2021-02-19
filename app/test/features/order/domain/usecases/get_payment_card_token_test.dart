import 'package:DRUN/core/usecases/usecase.dart';
import 'package:DRUN/features/order/domain/repositories/orders_repository.dart';
import 'package:DRUN/features/order/domain/usecases/get_payment_card_token.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

class MockOrderRepository extends Mock implements OrdersRepository {}

void main() {
  GetPaymentCardToken usecase;
  MockOrderRepository mockOrderRepository;

  setUp(() {
    mockOrderRepository = MockOrderRepository();
    usecase = GetPaymentCardToken(ordersRepository: mockOrderRepository);
  });

  final tPaymentCardToken = 'tok_1IMSCX2eZvKYlo2CE3RnWinh';

  test(
    'should get payment card token from the repository',
    () async {
      // Arrange
      when(
        mockOrderRepository.getPaymentCardToken(),
      ).thenAnswer((_) async => Right(tPaymentCardToken));

      // Act
      final result = await usecase(NoParams());

      // Assert
      expect(result, Right(tPaymentCardToken));
      verify(
        mockOrderRepository.getPaymentCardToken(),
      );
      verifyNoMoreInteractions(mockOrderRepository);
    },
  );
}
