import { AwsConfig, ValidationError } from "./types";

export class AwsConfigValidator {
  static validate(config: AwsConfig): void {
    if (!config.region) {
      throw new ValidationError("AWS region is required");
    }

    // Check environment variables if credentials not provided
    if (!config.credentials.accessKeyId) {
      config.credentials.accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
    }
    if (!config.credentials.secretAccessKey) {
      config.credentials.secretAccessKey = Deno.env.get(
        "AWS_SECRET_ACCESS_KEY"
      );
    }
    if (!config.credentials.sessionToken) {
      config.credentials.sessionToken = Deno.env.get("AWS_SESSION_TOKEN");
    }

    if (
      !config.credentials.accessKeyId ||
      !config.credentials.secretAccessKey ||
      !config.credentials.sessionToken
    ) {
      throw new ValidationError(
        "AWS credentials are required either in config or environment variables"
      );
    }
  }
}
