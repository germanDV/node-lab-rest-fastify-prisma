import { describe, it, expect } from "@jest/globals"
import { populateAndValidateConfig, env } from "./config"

describe("utils > config", () => {
  const baseEnv = {
    NODE_ENV: "testing",
    HOST: "localhost",
    PORT: "80",
    REDIS_HOST: "127.0.0.1",
    REDIS_PORT: "6379",
    REDIS_TTL: "300",
  }

  it("should throw if invalid NODE_ENV", () => {
    const badEnv = { ...baseEnv, NODE_ENV: "not-in-enum" }
    expect(() => populateAndValidateConfig(badEnv)).toThrow()
  })

  it("should throw if missing env var", () => {
    const badEnv: Record<string, string> = { ...baseEnv }
    delete badEnv.HOST
    expect(() => populateAndValidateConfig(badEnv)).toThrow()
  })

  it("should successfully parse config from environment", () => {
    populateAndValidateConfig(baseEnv)
    expect(env("port")).toStrictEqual(80)
    expect(env("nodeEnv")).toStrictEqual("testing")
    expect(env("redisHost")).toStrictEqual("127.0.0.1")
  })
})
