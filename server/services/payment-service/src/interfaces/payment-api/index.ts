import Stripe from 'stripe';
import config from '../../../../core/config';
import makePaymentApi from './payment-api';

const stripe = new Stripe(
    config.stripeSecretKey,
    {apiVersion: '2020-08-27'},
);

const paymentApi = makePaymentApi({
  paymentLibrary: stripe,
  shippingCharge: 400,
});

export default paymentApi;
