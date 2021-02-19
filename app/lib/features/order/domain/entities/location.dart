import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

class Location extends Equatable {
  final num latitude;
  final num longitude;

  Location({
    @required this.latitude,
    @required this.longitude,
  })  : assert(latitude != null),
        assert(longitude != null);

  @override
  List<Object> get props => [latitude, longitude];
}
