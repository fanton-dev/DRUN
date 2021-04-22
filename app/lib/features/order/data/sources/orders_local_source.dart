import 'package:DRUN/core/errors/exceptions.dart';
import 'package:DRUN/features/order/data/models/location_model.dart';
import 'package:location/location.dart';

import '../../domain/entities/location.dart';

abstract class OrdersLocalSource {
  /// Determine the current position of the device.
  ///
  /// Throws a [PermissionException] when the location services are not
  /// enabled or permissions are denied.
  Future<LocationCoordinates> getCurrentLocationCoordinates();
}

class OrdersLocalSourceImpl implements OrdersLocalSource {
  @override
  Future<LocationCoordinates> getCurrentLocationCoordinates() async {
    Location location = new Location();

    bool _serviceEnabled;
    PermissionStatus _permissionGranted;
    LocationData _locationData;

    _serviceEnabled = await location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location.requestService();
      if (!_serviceEnabled) {
        throw new LocationException();
      }
    }

    _permissionGranted = await location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await location.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        throw new PermissionException();
      }
    }

    _locationData = await location.getLocation();
    return LocationCoordinatesModel.fromLocationService(_locationData);
  }
}
