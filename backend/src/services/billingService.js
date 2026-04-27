class BillingService {
  constructor({ paymentProvider } = {}) {
    this.paymentProvider = paymentProvider;
  }

  async createCheckoutSession(payload) {
    if (!this.paymentProvider) {
      throw new Error("Payment provider chưa được cấu hình");
    }

    return this.paymentProvider.createCheckoutSession(payload);
  }
}

export default BillingService;
