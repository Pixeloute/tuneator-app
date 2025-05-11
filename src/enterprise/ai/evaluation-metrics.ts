export class EvaluationMetricsService {
  bleu(reference: string, candidate: string): number {
    // Minimal stub: returns 1 if exact match, else 0
    return reference === candidate ? 1 : 0;
  }

  rouge(reference: string, candidate: string): number {
    // Minimal stub: returns 1 if exact match, else 0
    return reference === candidate ? 1 : 0;
  }

  hallucinationLikelihood(prompt: string, output: string): number {
    // Minimal stub: always returns 0.5
    return 0.5;
  }
} 