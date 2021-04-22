import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/location.dart';
import '../repositories/orders_repository.dart';

class GetCurrentLocationCoordinates
    extends UseCase<LocationCoordinates, NoParams> {
  final OrdersRepository ordersRepository;

  GetCurrentLocationCoordinates({
    @required this.ordersRepository,
  }) : assert(ordersRepository != null);

  @override
  Future<Either<Failure, LocationCoordinates>> call(NoParams params) async {
    return await ordersRepository.getCurrentLocation();
  }
}
