import { describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals"
import { FastifyInstance } from "fastify"
import { ImportMock } from "ts-mock-imports"
import { faker } from "@faker-js/faker"
import prisma from "../prisma"
import { build } from "../server"
import * as authService from "./author_service"

let app: FastifyInstance

beforeAll(async () => {
  app = await build()
})

afterAll(async () => {
  await prisma.$disconnect()
  app.close()
})

afterEach(() => {
  ImportMock.restore()
})

describe("Author endpoints with mocked service", () => {
  it("should create author", async () => {
    const id = +faker.random.numeric(6)
    const firstName = faker.name.firstName()
    const middleName = faker.name.middleName()
    const lastName = faker.name.lastName()

    ImportMock.mockFunction(authService, "createAuthor", {
      id,
      firstName,
      middleName,
      lastName,
    })

    const resp = await app.inject({
      method: "POST",
      url: "/author/",
      payload: { firstName, middleName, lastName },
    })

    const json = resp.json()

    expect(resp.statusCode).toStrictEqual(201)
    expect(json.id).toStrictEqual(id)
    expect(json.firstName).toStrictEqual(firstName)
    expect(json.middleName).toStrictEqual(middleName)
    expect(json.lastName).toStrictEqual(lastName)
  })

  it("should create author without middleName", async () => {
    const id = +faker.random.numeric(6)
    const firstName = faker.name.firstName()
    const middleName = ""
    const lastName = faker.name.lastName()

    ImportMock.mockFunction(authService, "createAuthor", {
      id,
      firstName,
      middleName,
      lastName,
    })

    const resp = await app.inject({
      method: "POST",
      url: "/author/",
      payload: { firstName, lastName },
    })

    const json = resp.json()

    expect(resp.statusCode).toStrictEqual(201)
    expect(json.id).toStrictEqual(id)
    expect(json.firstName).toStrictEqual(firstName)
    expect(json.middleName).toStrictEqual(middleName)
    expect(json.lastName).toStrictEqual(lastName)
  })

  it("should reject author without lastName", async () => {
    const firstName = faker.name.firstName()
    const middleName = faker.name.middleName()

    ImportMock.mockFunction(authService, "createAuthor", "Bad request")

    const resp = await app.inject({
      method: "POST",
      url: "/author/",
      payload: { firstName, middleName },
    })

    expect(resp.statusCode).toStrictEqual(400)
    expect(resp.body).toStrictEqual("body must have required property 'lastName'")
  })
})
