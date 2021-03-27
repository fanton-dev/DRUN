import config from 'config';
import Stripe from 'stripe';
import buildPaymentApi from './payment-api';

const stripe = new Stripe(
    config.get('STRIPE_SECRET_KEY'),
    {apiVersion: '2020-08-27'},
);

const paymentApi = buildPaymentApi({
  paymentLibrary: stripe,
  shippingCharge: 400,
});

export default paymentApi;
