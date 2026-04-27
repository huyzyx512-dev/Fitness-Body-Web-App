class AIRecommendationService {
  constructor({ aiProvider } = {}) {
    this.aiProvider = aiProvider;
  }

  async generateWorkoutPlan(payload) {
    if (!this.aiProvider) {
      throw new Error("AI provider chưa được cấu hình");
    }

    return this.aiProvider.generateWorkoutPlan(payload);
  }

  async generateProgressInsights(payload) {
    if (!this.aiProvider) {
      throw new Error("AI provider chưa được cấu hình");
    }

    return this.aiProvider.generateProgressInsights(payload);
  }
}

export default AIRecommendationService;
