import { PromptTemplate, PromptLog, PromptEvaluation } from './types';

export class PromptToolkitService {
  private templates: Map<string, PromptTemplate> = new Map();
  private logs: PromptLog[] = [];
  private evaluations: PromptEvaluation[] = [];

  addTemplate(template: PromptTemplate) {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  logPrompt(log: PromptLog) {
    this.logs.push(log);
  }

  getLogs(promptId: string): PromptLog[] {
    return this.logs.filter(l => l.promptId === promptId);
  }

  addEvaluation(evaluation: PromptEvaluation) {
    this.evaluations.push(evaluation);
  }

  getEvaluations(promptId: string): PromptEvaluation[] {
    return this.evaluations.filter(e => e.promptId === promptId);
  }
} 