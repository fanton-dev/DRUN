import 'package:dartz/dartz.dart';
import 'package:meta/meta.dart';

import '../../../../core/data/sources/network_info.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/entities/delivery_order.dart';
import '../../domain/entities/location.dart';
import '../../domain/repositories/orders_repository.dart';
import '../sources/orders_local_source.dart';
import '../sources/orders_remote_source.dart';

class OrdersRepositoryImpl implements OrdersRepository {
  final OrdersRemoteSource remoteSource;
  final OrdersLocalSource localSource;
  final NetworkInfo networkInfo;

  OrdersRepositoryImpl({
    @required this.remoteSource,
    @required this.localSource,
    @required this.networkInfo,
  })  : assert(remoteSource != null),
        assert(localSource != null),
        assert(networkInfo != null);

  @override
  Future<Either<Failure, String>> getPaymentCardToken() async {
    try {
      final paymentCardToken = await remoteSource.getPaymentCardToken();
      return Right(paymentCardToken);
    } on PaymentCardException {
      return Left(PaymentCardFailure());
    }
  }

  @override
  Future<Either<Failure, Location>> getCurrentLocation() async {
    try {
      final currentLocation = await localSource.getCurrentLocation();
      return Right(currentLocation);
    } on PermissionException {
      return Left(PermissionFailure());
    }
  }

  @override
  Future<Either<Failure, String>> makeDeliveryOrder(DeliveryOrder order) async {
    if (await networkInfo.isConnected) {
      try {
        final deliveryOrderId = await remoteSource.makeDeliveryOrder(order);
        return Right(deliveryOrderId);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
