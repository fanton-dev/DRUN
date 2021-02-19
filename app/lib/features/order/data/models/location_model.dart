import 'package:meta/meta.dart';

import '../../domain/entities/location.dart';

class LocationModel extends Location {
  final num latitude;
  final num longitude;

  LocationModel({
    @required this.latitude,
    @required this.longitude,
  })  : assert(latitude != null),
        assert(longitude != null),
        super(latitude: latitude, longitude: longitude);

  factory LocationModel.fromEntity(Location location) {
    return LocationModel(
      latitude: location.latitude,
      longitude: location.longitude,
    );
  }

  Map<String, dynamic> toJSON() {
    return {'latitude': this.latitude, 'longitude': this.longitude};
  }
}
