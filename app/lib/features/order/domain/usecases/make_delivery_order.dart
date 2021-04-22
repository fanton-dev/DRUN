import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/delivery_order.dart';
import '../repositories/orders_repository.dart';

class MakeDeliveryOrder extends UseCase<String, DeliveryOrderParams> {
  final OrdersRepository ordersRepository;

  MakeDeliveryOrder(
    this.ordersRepository,
  ) : assert(ordersRepository != null);

  @override
  Future<Either<Failure, String>> call(DeliveryOrderParams params) async {
    return await ordersRepository.makeDeliveryOrder(params.order);
  }
}

class DeliveryOrderParams extends Equatable {
  final DeliveryOrder order;

  DeliveryOrderParams({@required this.order});

  @override
  List<Object> get props => [order];
}
