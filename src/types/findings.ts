export interface LlmOutput {
  raw: string;
  interpreted?: boolean;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  llm_output?: LlmOutput;
  resource?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FindingStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}