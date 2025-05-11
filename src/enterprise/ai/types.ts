export type PromptType = 'few_shot' | 'cot' | 'role' | 'template';

export interface PromptTemplate {
  id: string;
  name: string;
  type: PromptType;
  content: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptLog {
  id: string;
  promptId: string;
  input: string;
  output: string;
  before: any;
  after: any;
  timestamp: string;
  userId: string;
}

export interface PromptEvaluation {
  promptId: string;
  bleu?: number;
  rouge?: number;
  hallucinationLikelihood?: number;
  notes?: string;
  evaluatedAt: string;
} 