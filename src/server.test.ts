import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"
import { FastifyInstance } from "fastify"
import prisma from "./prisma"
import { build } from "./server"

let app: FastifyInstance

beforeAll(async () => {
  app = await build()
})

afterAll(async () => {
  await prisma.$disconnect()
  app.close()
})

describe("/healthcheck", () => {
  it("should return 200 with OK message", async () => {
    const resp = await app.inject({ method: "GET", url: "/healthcheck" })
    expect(resp.statusCode).toStrictEqual(200)
    expect(resp.body).toStrictEqual(JSON.stringify({ status: "ok" }))
  })
})
