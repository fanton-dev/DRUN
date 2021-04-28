import 'dart:convert';

import 'package:DRUN/features/order/data/models/location_model.dart';
import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../fixtures/fixture_parser.dart';

void main() {
  final tLocationCoordinatesModel = LocationCoordinatesModel(
    latitude: 42.662388,
    longitude: 23.373416,
  );

  test(
    'should be an extension of DeliveryOrder entity',
    () async {
      // Assert
      expect(
        tLocationCoordinatesModel,
        isA<LocationCoordinates>(),
      );
    },
  );

  test(
    'should convert to JSON',
    () async {
      // Act
      final result = tLocationCoordinatesModel.toJSON();

      // Assert
      expect(result, json.decode(fixture('location.json')));
    },
  );
}
