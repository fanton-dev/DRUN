import 'package:DRUN/features/order/domain/repositories/orders_repository.dart';
import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';

class GetPaymentCardToken implements UseCase<String, NoParams> {
  final OrdersRepository ordersRepository;

  GetPaymentCardToken({
    @required this.ordersRepository,
  }) : assert(ordersRepository != null);

  @override
  Future<Either<Failure, String>> call(NoParams params) async {
    return await ordersRepository.getCardPaymentToken();
  }
}
