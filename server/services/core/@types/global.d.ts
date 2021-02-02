import {Connection} from 'amqplib';
import {ConsumeMessage, Options, Replies} from 'amqplib/properties';
import {ParamsDictionary} from 'express-serve-static-core';
import {QueryConfig, QueryResult, QueryResultRow} from 'pg';
import Stripe from 'stripe';

/**
 * Validator object structure.
 *
 * @exports
 * @interface Validator
 */
export interface Validator {
  validateIdentifier(identifier: string): void;
  validateLocation(location: Location): void;
  validateRoute(
    homeLocation: Location,
    senderLocation: Location,
    receiverLocation: Location,
    maxDistance: number,
  ): number;
  validatePaymentCard(paymentCard: PaymentCard): void;
}

/**
 * Location object structure.
 *
 * @exports
 * @interface Location
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Location export object structure.
 * @exports
 * @interface LocationExport
 */
interface LocationExport {
  getLatitude(): number;
  getLongitude(): number;
}

/**
 * Sender/Receiver object structure.
 *
 * @exports
 * @interface Person
 */
export interface Person {
  id: string;
  location: Location;
}

/**
 * Sender/Receiver export object structure.
 *
 * @exports
 * @interface PersonExport
 */
export interface PersonExport {
  getId(): string;
  getLocation(): LocationExport;
}

/**
 * PaymentCard object structure.
 *
 * @exports
 * @interface PaymentCard
 */
export interface PaymentCard {
  number: string;
  date: string;
  cvc: string;
}

/**
 * PaymentCard export object structure.
 *
 * @exports
 * @interface PaymentCardExport
 */
export interface PaymentCardExport {
  getNumber(): string;
  getDate(): string;
  getCvc(): string;
}

/**
 * Request Source object structure.
 *
 * @exports
 * @interface Source
 */
export interface Source {
  ip: string;
  browser: string;
  referrer: string;
}

/**
 * Source export object structure.
 *
 * @exports
 * @interface SourceExport
 */
export interface SourceExport {
  getIp(): string;
  getBrowser(): string;
  getReferrer(): string;
}

/**
 * Order object structure without payment data.
 *
 * @interface OrderWithoutPaymentCard
 */
export interface OrderWithoutPaymentCard {
  id?: string;
  sender: Person;
  receiver: Person;
  source: Source;
  createdOn?: number;
}

/**
 * Order object structure.
 *
 * @exports
 * @interface Order
 */
export interface Order extends OrderWithoutPaymentCard {
  paymentCard: PaymentCard;
}

/**
 * Order export object structure.
 *
 * @exports
 * @interface OrderExport
 */
export interface OrderExport {
  getId(): string;
  getSender(): PersonExport;
  getReceiver(): PersonExport;
  getPaymentCard(): PaymentCardExport;
  getSource(): SourceExport;
  getCreatedOn(): number;
}

/* eslint-disable camelcase */
/**
 * Order object database schema.
 *
 * @exports
 * @interface OrderDatabaseSchema
 */
export interface OrderDatabaseSchema {
  id: string;
  sender_id: string;
  sender_location_latitude: number;
  sender_location_longitude: number;
  receiver_id: string;
  receiver_location_latitude: number;
  receiver_location_longitude: number;
  source_ip: string;
  source_browser: string;
  source_referrer: string;
  created_on: number;
}
/* eslint-enable camelcase */

/**
 * Payment object structure without payment data.
 *
 * @exports
 * @interface Payment
 */
export interface PaymentWithoutPaymentCard {
  id?: string;
  orderId: string;
  paymentCardToken?: string | undefined;
  createdOn?: number;
  completedOn?: number | undefined;
}

/**
 * Payment object structure.
 *
 * @export
 * @interface Payment
 * @extends {PaymentWithoutPaymentCard}
 */
export interface Payment extends PaymentWithoutPaymentCard {
  paymentCard: PaymentCard;
}

/**
 * Payment export object structure.
 *
 * @exports
 * @interface PaymentExport
 */
export interface PaymentExport {
  getId(): string;
  getOrderId(): string;
  getPaymentCard(): PaymentCardExport;
  getPaymentCardToken(): string | undefined;
  getCreatedOn(): number;
  getCompletedOn(): number | undefined;
  isCompleted(): boolean;
  setPaymentCardToken(token: string): string;
  markAsCompleted(): number;
}

/* eslint-disable camelcase */
/**
 * Payment object database schema.
 *
 * @exports
 * @interface PaymentDatabaseSchema
 */
export interface PaymentDatabaseSchema {
  id: string;
  order_id: string;
  payment_card_token: string;
  created_on: number;
  completed_on: number;
}
/* eslint-enable camelcase */

/**
 * Drone object structure.
 *
 * @exports
 * @interface Drone
 */
export interface Drone {
  source: Source;
  homeLocation: Location;
}

/**
 * Drone export object structure.
 *
 * @interface DroneExport
 */
interface DroneExport {
    getId(): string;
    getSource(): SourceExport;
    getHomeLocation(): LocationExport;
    getIsBusy(): boolean;
    getConnectedOn(): number;
    markAsBusy(): boolean;
    markAsNotBusy(): boolean;
}

/**
 * Delivery object structure.
 *
 * @exports
 * @interface Delivery
 */
export interface Delivery {
  id?: string;
  orderId: string;
  drone: DroneExport;
  senderLocation: Location;
  receiverLocation: Location;
  createdOn: number;
  completedOn: number | undefined
}

/**
 * Delivery export object structure.
 *
 * @exports
 * @interface DeliveryExport
 */
export interface DeliveryExport {
  getId(): string;
  getOrderId(): string;
  getDrone(): DroneExport;
  getSenderLocation(): LocationExport;
  getReceiverLocation(): LocationExport;
  getCreatedOn(): number;
  getCompletedOn(): number | undefined;
  markAsCompleted(): number;
}

/**
 * HTTP Request object structure.
 *
 * @exports
 * @interface HttpRequest
 */
export interface HttpRequest {
  headers: any;
  body: any;
  params?: ParamsDictionary;
  ip?: string;
  method?: string;
  path?: string;
  query?: any;
}

/**
 * HTTP Response object structure.
 *
 * @exports
 * @interface HttpResponse
 */
export interface HttpResponse {
  headers: any;
  body: any;
  statusCode: number;
}

/**
 * Shared Queue object structure.
 *
 * @exports
 * @interface SharedQueue
 */
export interface SharedQueue {
  emit(queueNames: Array<string>, message: QueueMessage): Promise<void>;
  listen(
    queueName: string,
    callback: (message: QueueMessage) => any,
  ): Promise<void>;
}

/**
 * Queue Library object structure.
 *
 * @exports
 * @interface QueueLibrary
 */
export interface QueueLibrary {
  connect(
    url: string | Options.Connect,
    socketOptions?: any
  ): Promise<Connection>;
}

/**
 * Queue Connection object structure.
 *
 * @exports
 * @interface QueueConnection
 */
export interface QueueConnection {
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
 * @exports
 * @interface QueueChannel
 */
export interface QueueChannel {
  consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => void,
    options?: Options.Consume,
  ): Promise<Replies.Consume>;

  assertQueue(
    queue: string,
    options?: Options.AssertQueue,
  ): Promise<Replies.AssertQueue>;

  sendToQueue(
    queue: string,
    content: Buffer,
    options?: Options.Publish,
  ): boolean;

  consume(
    queue: string,
    onMessage: (msg: ConsumeMessage | null) => void,
    options?: Options.Consume,
  ): Promise<Replies.Consume>;

  close(): Promise<void>;
}

/**
 * Queue Message (raw) object structure.
 *
 * @export
 * @interface QueueMessageRaw
 * @extends {ConsumeMessage}
 */
export interface QueueMessageRaw extends ConsumeMessage {}

/**
 * Queue message object structure.
 *
 * @export
 * @interface QueueMessage
 */
export interface QueueMessage {
  subject: string;
  body: string | object;
}

/**
 * Database client object structure.
 *
 * @exports
 * @interface DatabaseClient
 */
export interface DatabaseClient {
  query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: any[],
  ): Promise<QueryResult<R>>;
}

/**
 * Order Database Controller object structure.
 *
 * @exports
 * @interface OrderDatabaseController
 */
export interface OrderDatabaseController {
  insert({
    id,
    sender,
    receiver,
    source,
    createdOn,
  }: OrderWithoutPaymentCard): Promise<{ id: string } | { error: string; }>;

  findById(
    orderId: string,
): Promise<OrderWithoutPaymentCard | { error: string; }>;
}

/**
 * Payment Database Controller object structure.
 *
 * @exports
 * @interface PaymentDatabaseController
 */
export interface PaymentDatabaseController {
  insert({
    id,
    orderId,
    paymentCardToken,
    createdOn,
    completedOn,
  }: PaymentWithoutPaymentCard): Promise<{ id: string } | { error: string; }>;

  findById(
    paymentId: string,
  ): Promise<PaymentWithoutPaymentCard | { error: string; }>;
}

/**
 * Order Database Query Results object structure.
 *
 * @export
 * @interface OrderDatabaseQueryResults
 * @extends {QueryResult<OrderDatabaseSchema>}
 */
export interface DatabaseQueryResults<T> extends QueryResult<T> {}

/**
 * Payment API object structure.
 *
 * @exports
 * @interface PaymentApi
 */
export interface PaymentApi {
  paymentCardToToken(
    paymentCard: PaymentCard,
  ): Promise<string>;

  charge(
    token: string,
    description: string,
  ): Promise<PaymentApiCharge>;
}

/**
 * Payment library object structure.
 *
 * @exports
 * @interface PaymentLibrary
 */
export interface PaymentLibrary {
  tokens: Stripe.TokensResource;
  charges: Stripe.ChargesResource;
}


/**
 * Payment API charge object structure.
 *
 * @exports
 * @interface PaymentApiToken
 */
export interface PaymentApiCharge extends Stripe.Response<Stripe.Charge> {}
