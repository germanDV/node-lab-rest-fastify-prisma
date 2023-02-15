import { z } from "zod"

const configSchema = z.object({
  nodeEnv: z.enum(["production", "development", "testing"]),
  host: z.string({
    required_error: "HOST is required",
    invalid_type_error: "HOST must be a string",
  }),
  port: z.coerce
    .number({
      required_error: "PORT is required",
      invalid_type_error: "PORT must be a number",
    })
    .positive("PORT must be a valid port number"),
  redisHost: z.string({
    required_error: "REDIS_HOST is required",
    invalid_type_error: "REDIS_HOST must be a string",
  }),
  redisPort: z.coerce
    .number({
      required_error: "REDIS_PORT is required",
      invalid_type_error: "REDIS_PORT must be a number",
    })
    .positive("REDIS_PORT must be a valid port number"),
  redisTTL: z.coerce
    .number({
      required_error: "REDIS_TTL is required",
      invalid_type_error: "REDIS_TTL must be a number",
    })
    .positive("REDIS_TTL must be a positive number"),
})

type Config = z.infer<typeof configSchema>

let config: Config

/**
 * Creates a config object with values from environment variables.
 * If there are env vars missing or incorrect, it trows.
 */
export function populateAndValidateConfig(source: Record<string, string | undefined>) {
  if (!config) {
    const nodeEnv = source.NODE_ENV
    const host = source.HOST
    const port = source.PORT
    const redisHost = source.REDIS_HOST
    const redisPort = source.REDIS_PORT
    const redisTTL = source.REDIS_TTL
    config = configSchema.parse({ nodeEnv, host, port, redisHost, redisPort, redisTTL })
  }
}

export function env<T extends keyof Config>(key: T): Config[T] {
  if (!config) {
    populateAndValidateConfig(process.env)
  }
  return config[key]
}
