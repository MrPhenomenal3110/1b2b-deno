// types.ts

export interface PlatformConfig {
  name: string;
  placement: string;
  device_targeting: string[];
  objective: string;
}

export interface AdPayload {
  message: any; // Image/PSD analysis JSON
  platform: PlatformConfig;
}

export interface ComplianceIssue {
  element: string;
  current_value: string;
  requirement: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
}

export interface DetailedAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
}

export interface ApprovalPrediction {
  likely_to_be_approved: boolean;
  potential_blockers: string[];
  suggested_fixes: string[];
}

export interface ComplianceResult {
  compliance_status: "COMPLIANT" | "NON_COMPLIANT";
  platform_specific_issues: ComplianceIssue[];
  general_recommendations: string[];
  estimated_performance_impact: "HIGH" | "MEDIUM" | "LOW";
  detailed_analysis: DetailedAnalysis;
  approval_prediction: ApprovalPrediction;
}

export interface AwsConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
  };
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ClaudeServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public originalError?: any
  ) {
    super(message);
    this.name = "ClaudeServiceError";
  }
}
