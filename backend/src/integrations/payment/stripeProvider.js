import PaymentProvider from "./paymentProvider.js";

class StripeProvider extends PaymentProvider {
  constructor({ secretKey, webhookSecret } = {}) {
    super();
    this.secretKey = secretKey;
    this.webhookSecret = webhookSecret;
  }
}

export default StripeProvider;
