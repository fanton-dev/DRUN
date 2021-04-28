import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class LocationCoordinates extends Equatable {
  final num latitude;
  final num longitude;

  LocationCoordinates({
    @required this.latitude,
    @required this.longitude,
  })  : assert(latitude != null),
        assert(longitude != null);

  @override
  List<Object> get props => [latitude, longitude];
}
