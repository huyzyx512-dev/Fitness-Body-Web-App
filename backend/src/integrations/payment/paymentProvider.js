class PaymentProvider {
  async createCheckoutSession() {
    throw new Error("createCheckoutSession chưa được triển khai");
  }

  async handleWebhook() {
    throw new Error("handleWebhook chưa được triển khai");
  }
}

export default PaymentProvider;
