// server.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { ClaudeService } from "./aws_claude_service.ts";
import { ValidationError, AdPayload } from "./types.ts";

// Environment validation
function validateEnvironment(): void {
  const requiredEnvVars = [
    "AWS_DEFAULT_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_SESSION_TOKEN",
  ];
  requiredEnvVars.forEach((e) => console.log(Deno.env.get(e)));
  const missing = requiredEnvVars.filter((varName) => !Deno.env.get(varName));

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Request validation
function validatePayload(payload: any): asserts payload is AdPayload {
  if (!payload.message) {
    throw new ValidationError("Missing required field: message");
  }
  if (!payload.platform) {
    throw new ValidationError("Missing required field: platform");
  }
  if (!payload.platform.name) {
    throw new ValidationError("Missing required field: platform.name");
  }
  if (!payload.platform.placement) {
    throw new ValidationError("Missing required field: platform.placement");
  }
  if (!Array.isArray(payload.platform.device_targeting)) {
    throw new ValidationError("platform.device_targeting must be an array");
  }
  if (!payload.platform.objective) {
    throw new ValidationError("Missing required field: platform.objective");
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

try {
  validateEnvironment();

  const awsConfig = {
    region: Deno.env.get("AWS_DEFAULT_REGION")!,
    credentials: {
      accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
      secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
      sessionToken: Deno.env.get("AWS_SESSION_TOKEN")!,
    },
  };

  const claudeService = new ClaudeService(awsConfig);

  serve(
    async (req: Request) => {
      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      if (req.method !== "POST") {
        return new Response(
          JSON.stringify({
            error: "Method not allowed",
          }),
          {
            status: 405,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      try {
        const payload = await req.json();
        validatePayload(payload);

        // Get Claude's response
        const claudeResponse = await claudeService.analyzeCompliance(payload);

        // Try to extract the JSON content from Claude's response
        try {
          // If the response is a string (it might include markdown or other formatting)
          if (typeof claudeResponse === "string") {
            // Look for JSON content within the response
            const jsonMatch =
              claudeResponse.match(/```json\n([\s\S]*?)\n```/) ||
              claudeResponse.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
              return new Response(jsonMatch[1] || jsonMatch[0], {
                status: 200,
                headers: {
                  ...corsHeaders,
                  "Content-Type": "application/json",
                },
              });
            }
          }

          // If it's already a JSON object, return it directly
          return new Response(claudeResponse.content[0].text, {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        } catch (parseError) {
          // If parsing fails, return the raw response
          return new Response(claudeResponse, {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.error("Error processing request:", error);

        const status = error instanceof ValidationError ? 400 : 500;
        const errorResponse = {
          error:
            error instanceof ValidationError
              ? error.message
              : "Internal server error",
          code:
            error instanceof ValidationError
              ? "VALIDATION_ERROR"
              : "INTERNAL_ERROR",
        };

        return new Response(JSON.stringify(errorResponse), {
          status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    },
    {
      port: 8000,
      onListen: ({ port, hostname }) => {
        console.log(`Ad Compliance API running on http://${hostname}:${port}`);
      },
    }
  );
} catch (error) {
  console.error("Server startup error:", error);
  Deno.exit(1);
}
