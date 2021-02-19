import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/location.dart';
import '../repositories/orders_repository.dart';

class GetCurrentLocation extends UseCase<Location, NoParams> {
  final OrdersRepository ordersRepository;

  GetCurrentLocation({
    @required this.ordersRepository,
  }) : assert(ordersRepository != null);

  @override
  Future<Either<Failure, Location>> call(NoParams params) async {
    return await ordersRepository.getCurrentLocation();
  }
}
