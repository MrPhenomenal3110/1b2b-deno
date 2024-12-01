// aws_claude_service.ts

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "https://esm.sh/@aws-sdk/client-bedrock-runtime";
import { AdPayload, AwsConfig, ClaudeServiceError } from "./types.ts";
import { PlatformGuidelines } from "./platform_guidelines.ts";

export class ClaudeService {
  private client: BedrockRuntimeClient;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  constructor(config: AwsConfig) {
    this.client = new BedrockRuntimeClient({
      region: config.region,
      credentials: config.credentials,
    });
  }

  private getSystemPrompt(platform: string, placement: string): string {
    const rules = JSON.stringify(
      PlatformGuidelines[platform][placement],
      null,
      2
    );

    return `You are an expert advertising compliance analyst for ${platform} ${placement}.

Your task is to analyze the provided image/PSD analysis JSON and evaluate its compliance with platform guidelines.

Platform Guidelines for ${platform} ${placement}:
${rules}

Analyze the following aspects in detail:
1. Image Specifications:
   - Check dimensions and aspect ratios
   - Validate file specifications
   - Assess image quality and composition
   
2. Text Content:
   - Review all text elements for length compliance
   - Analyze text overlay percentage
   - Check font sizes and readability
   
3. Creative Elements:
   - Evaluate overall design balance
   - Check branding elements
   - Assess visual hierarchy
   
4. Technical Compliance:
   - Verify file format compliance
   - Check resolution requirements
   - Validate color specifications

5. Performance Optimization:
   - Assess potential delivery issues
   - Evaluate engagement factors
   - Check device compatibility

Also consider:
- Brand safety aspects
- Best practices for the platform
- Common approval blockers
- Performance optimization opportunities

Respond with a JSON object in this exact format: (Do not add \`\`\` json \`\`\` and all that)
{
    "compliance_status": "COMPLIANT" | "NON_COMPLIANT",
    "platform_specific_issues": [
        {
            "element": string,
            "current_value": string,
            "current_position_of_element": [ 
              // send this field only if the element is a text-type element
              // IMPORTANT: these will be the four co-ordinates, creating a rectangle around the text.
              // IMPORTANT: Consider the bottom left as x=0 and y=0
              "top-left": {
                "x": string (in pixel), // do not provide random values. These should be proper and accurate.
                "y": string (in pixel) // do not provide random values. These should be proper and accurate.
              },
              "top-right": {
                "x": string (in pixel), // do not provide random values. These should be proper and accurate.
                "y": string (in pixel)  // do not provide random values. These should be proper and accurate.
              },
              "bottom-left": {
                "x": string (in pixel), // do not provide random values. These should be proper and accurate.
                "y": string (in pixel)  // do not provide random values. These should be proper and accurate.
              },
              "bottom-right": {
                "x": string (in pixel), // do not provide random values. These should be proper and accurate.
                "y": string (in pixel)  // do not provide random values. These should be proper and accurate.
              }
            ],
            "requirement": string,
            "severity": "HIGH" | "MEDIUM" | "LOW",
            "recommendation": string
        }
    ],
    "general_recommendations": string[],
    "estimated_performance_impact": "HIGH" | "MEDIUM" | "LOW",
    "detailed_analysis": {
        "strengths": string[],
        "weaknesses": string[],
        "opportunities": string[],
        "risks": string[]
    },
    "approval_prediction": {
        "likely_to_be_approved": boolean,
        "potential_blockers": string[],
        "suggested_fixes": string[]
    }
}`;
  }

  async analyzeCompliance(payload: AdPayload): Promise<any> {
    const input = {
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        temperature: 0,
        system: this.getSystemPrompt(
          payload.platform.name,
          payload.platform.placement
        ),
        messages: [
          {
            role: "user",
            content: `Analyze this ${payload.platform.name} ${
              payload.platform.placement
            } ad for compliance and optimization opportunities:
            ${JSON.stringify(payload.message, null, 2)}
            
            Consider the specified objective: ${payload.platform.objective}
            Target devices: ${payload.platform.device_targeting.join(", ")}
            
            Provide a detailed analysis focusing on both technical compliance and creative optimization.`,
          },
        ],
        max_tokens: 30000,
      }),
      contentType: "application/json",
    };

    try {
      const command = new InvokeModelCommand(input);
      const response = await this.client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      return JSON.parse(responseBody);
    } catch (error) {
      throw new ClaudeServiceError(
        "Error calling Claude API",
        "CLAUDE_API_ERROR",
        500,
        error
      );
    }
  }
}
