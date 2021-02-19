import '../../domain/entities/location.dart';

abstract class OrdersLocalSource {
  /// Determine the current position of the device.
  ///
  /// Throws a [PermissionException] when the location services are not
  /// enabled or permissions are denied.
  Future<Location> getCurrentLocation();
}
