import {ParamsDictionary} from 'express-serve-static-core';

/**
 * Validator object structure.
 *
 * @interface Validator
 */
interface Validator {
  validateIdentifier: (identifier: string) => void,
  validateLocation: (location: Location) => void,
  validateRoute: (
    homeLocation: Location,
    senderLocation: Location,
    receiverLocation: Location,
    maxDistance: number,
  ) => number,
  validatePaymentCard: (paymentCard: PaymentCard) => void
}

/**
 * Location object structure.
 *
 * @interface Location
 */
interface Location {
  latitude: number,
  longitude: number
}

/**
 * Location export object structure.
 *
 * @interface LocationExport
 */
interface LocationExport {
  getLatitude: () => number,
  getLongitude: () => number
}

/**
 * Sender/Receiver object structure.
 *
 * @interface Person
 */
interface Person {
  id: string,
  location: Location,
}

/**
 * Sender/Receiver export object structure.
 *
 * @interface PersonExport
 */
interface PersonExport {
  getId: () => string,
  getLocation: () => LocationExport
}

/**
 * PaymentCard object structure.
 *
 * @interface PaymentCard
 */
interface PaymentCard {
  number: string,
  date: string,
  CVC: string
}

/**
 * PaymentCard export object structure.
 *
 * @interface PaymentCardExport
 */
interface PaymentCardExport {
  getNumber: () => string,
  getDate: () => string,
  getCVC: () => string
}

/**
 * Request Source object structure.
 *
 * @interface Source
 */
interface Source {
  ip: string,
  browser: string,
  referrer: string,
}

/**
 * Source export object structure.
 *
 * @interface SourceExport
 */
interface SourceExport {
  getIp: () => string,
  getBrowser: () => string,
  getReferrer: () => string
}

/**
 * Order object structure without payment data.
 *
 * @interface OrderWithoutPaymentCard
 */
interface OrderWithoutPaymentCard {
  id?: string,
  sender: Person,
  receiver: Person,
  source: Source,
  createdOn?: number
}

/**
 * Order object structure.
 *
 * @interface Order
 */
interface Order extends OrderWithoutPaymentCard {
  paymentCard: PaymentCard,
}

/**
 * Order export object structure.
 *
 * @interface OrderExport
 */
interface OrderExport {
  getId: () => string,
  getSender: () => PersonExport,
  getReceiver: () => PersonExport,
  getPaymentCard: () => PaymentCardExport,
  getSource: () => SourceExport,
  getCreatedOn: () => number,
}

/* eslint-disable camelcase */
/**
 * Order object database schema.
 *
 * @interface OrderDbSchema
 */
interface OrderDbSchema {
  id: string,
  sender_id: string,
  sender_location_latitude: number,
  sender_location_longitude: number,
  receiver_id: Person,
  receiver_location_latitude: number,
  receiver_location_longitude: number,
  source_ip: string,
  source_browser: string,
  source_referrer: string,
  created_on: number
}
/* eslint-enable camelcase */

/**
 * Payment object structure.
 *
 * @interface Payment
 */
interface Payment {
  orderId: string,
  paymentCard: PaymentCard,
}

/**
 * Payment export object structure.
 *
 * @interface PaymentExport
 */
interface PaymentExport {
  getOrderId: () => string,
  getPaymentCard: () => PaymentCardExport,
}

/**
 * Drone object structure.
 *
 * @interface Drone
 */
interface Drone {
  source: Source,
  homeLocation: Location,
}

/**
 * Drone export object structure.
 * TO-DO fix this mess of an interface.
 *
 * @interface DroneExport
 */
interface DroneExport {
    getId: () => string,
    getDroneSource: () => Source,
    getHomeLocation: () => Location,
    getIsBusy: () => boolean,
    getDrone: () => DroneExport,
    getConnectedOn: () => number,
    markAsBusy: Function,
    markAsNotBusy: Function,
}

/**
 * Delivery object structure.
 *
 * @interface Delivery
 */
interface Delivery {
  orderId: string,
  drone: DroneExport,
  senderLocation: Location,
  receiverLocation: Location,
  source: SourceExport,
}

/**
 * Delivery object structure.
 *
 * @interface DeliveryExport
 */
interface DeliveryExport {
  getOrderId: () => string,
  getDrone: () => DroneExport,
  getSenderLocation: () => LocationExport,
  getReceiverLocation: () => LocationExport,
  getSource: () => SourceExport,
}

/**
 * HTTP Request object structure.
 *
 * @interface HttpRequest
 * @extends {Request}
 */
interface HttpRequest {
  headers: any,
  body: any,
  params?: ParamsDictionary,
  ip?: string,
  method?: string,
  path?: string,
  query?: any
}

/**
 * HTTP Response object structure.
 *
 * @interface HttpResponse
 * @extends {Response}
 */
interface HttpResponse {
  headers: any;
  body: any;
  statusCode: number;
}

/**
 * Shared Queue object structure.
 *
 * @interface SharedQueue
 */
interface SharedQueue {
  emit(queueNames: Array<string>, message: object): Promise<void>;
  listen(
    queueName: string,
    callback: (message: object) => any,
  ): Promise<void>;
}

/**
 * Queue Library object structure.
 *
 * @interface QueueLibrary
 */
interface QueueLibrary {
  connect: Function;
}

/**
 * Queue Connection object structure.
 *
 * @interface QueueConnection
 */
interface QueueConnection {
  close(): Promise<void>;
  createChannel(): Promise<QueueChannel>;
  connection: {
    serverProperties: {
      host: string;
      product: string;
      version: string;
      platform: string;
      copyright?: string;
      information: string;
      [key: string]: string | undefined;
    };
  };
}

/**
 * Queue Channel object structure.
 *
 * @interface QueueChannel
 */
interface QueueChannel {
  consume(
    queue: string,
    onMessage: (msg: QueueMessage | null) => void,
    options?: object
  ): Promise<void>;

  assertQueue(
    queue?: string,
    options?: object
  ): Promise<void>;

  sendToQueue(
    queue: string,
    content: Buffer,
    options?: object
  ): Promise<boolean>;

  prefetch(count: number, global?: boolean): Promise<any>;

  close(callback: (err: any) => void): void;
}

interface QueueMessage {
  content: Buffer;
  fields: {
    messageCount?: number;
    consumerTag?: string;
  };
  properties: {
    contentType: any | undefined;
    contentEncoding: any | undefined;
    headers: {
      'x-first-death-exchange'?: string;
      'x-first-death-queue'?: string;
      'x-first-death-reason'?: string;
      [key: string]: any;
    };
    deliveryMode: any | undefined;
    priority: any | undefined;
    correlationId: any | undefined;
    replyTo: any | undefined;
    expiration: any | undefined;
    messageId: any | undefined;
    timestamp: any | undefined;
    type: any | undefined;
    userId: any | undefined;
    appId: any | undefined;
    clusterId: any | undefined;
  };
}

/**
 * Database client object structure.
 *
 * @interface DatabaseClient
 */
interface DatabaseClient {
  connect: Function,
  query: Function,
  end: Function,
}

/**
 * Database Controller object structure.
 *
 * @interface DatabaseController
 */
interface DatabaseController {
  insert: Function,
  findById: Function,
}

export {
  Validator,
  Location,
  LocationExport,
  Person,
  PersonExport,
  PaymentCard,
  PaymentCardExport,
  Source,
  SourceExport,
  OrderWithoutPaymentCard,
  Order,
  OrderExport,
  OrderDbSchema,
  Payment,
  PaymentExport,
  Drone,
  DroneExport,
  Delivery,
  HttpRequest,
  DeliveryExport,
  HttpResponse,
  SharedQueue,
  QueueLibrary,
  QueueConnection,
  QueueChannel,
  QueueMessage,
  DatabaseClient,
  DatabaseController,
};
