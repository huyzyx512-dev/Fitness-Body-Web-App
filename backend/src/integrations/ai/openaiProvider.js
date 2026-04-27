import AIProvider from "./aiProvider.js";

class OpenAIProvider extends AIProvider {
  constructor({ apiKey, model } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model || "gpt-4.1-mini";
  }
}

export default OpenAIProvider;
