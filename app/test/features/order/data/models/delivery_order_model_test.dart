import 'dart:convert';

import 'package:DRUN/features/order/data/models/delivery_order_model.dart';
import 'package:DRUN/features/order/domain/entities/delivery_order.dart';
import 'package:DRUN/features/order/domain/entities/location.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../fixtures/fixture_parser.dart';

void main() {
  final tDeliveryOrderModel = DeliveryOrderModel(
    senderUserId: '4ade5874-c573-4c8f-b2b8-7db5fccd983b',
    senderLocation: Location(latitude: 42.662388, longitude: 23.373416),
    receiverUserId: '35040675-6bdb-4d26-8d38-bc46bdeaf56f',
    receiverLocation: Location(latitude: 42.652900, longitude: 23.354952),
    paymentCardToken: 'tok_1IMSCX2eZvKYlo2CE3RnWinh',
  );

  test(
    'should be an extension of DeliveryOrder entity',
    () async {
      // Assert
      expect(
        tDeliveryOrderModel,
        isA<DeliveryOrder>(),
      );
    },
  );

  test(
    'should convert to JSON',
    () async {
      // Act
      final result = tDeliveryOrderModel.toJSON();

      // Assert
      expect(result, json.decode(fixture('delivery_order_request.json')));
    },
  );
}
