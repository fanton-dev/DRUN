import 'package:dartz/dartz.dart';

import '../../../../core/errors/failures.dart';
import '../entities/delivery_order.dart';
import '../entities/location.dart';

abstract class OrdersRepository {
  Future<Either<Failure, Location>> getCurrentLocation();

  Future<Either<Failure, String>> getCardPaymentToken();

  Future<Either<Failure, String>> makeDeliveryOrder(DeliveryOrder order);
}
