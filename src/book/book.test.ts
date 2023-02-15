import { describe, it, expect, beforeAll, afterAll, afterEach } from "@jest/globals"
import { FastifyInstance } from "fastify"
import { ImportMock } from "ts-mock-imports"
import { faker } from "@faker-js/faker"
import prisma from "../prisma"
import { build } from "../server"
import * as bookService from "./book_service"

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

describe("Book endpoints with mocked service", () => {
  it("should create book", async () => {
    const id = +faker.random.numeric(6)
    const authorId = +faker.random.numeric(6)
    const title = faker.random.words(3)
    const price = +faker.commerce.price(1, 100)
    const createdAt = new Date()

    ImportMock.mockFunction(bookService, "createBook", {
      id,
      title,
      price,
      authorId,
      createdAt,
    })

    const resp = await app.inject({
      method: "POST",
      url: "/book/",
      payload: { title, authorId, price },
    })

    const json = resp.json()

    expect(resp.statusCode).toStrictEqual(201)
    expect(json.id).toStrictEqual(id)
    expect(json.title).toStrictEqual(title)
    expect(json.price).toStrictEqual(price)
    expect(json.authorId).toStrictEqual(authorId)
    expect(new Date(json.createdAt)).toStrictEqual(createdAt)
  })

  it("should reject book without title", async () => {
    const authorId = +faker.random.numeric(6)
    const price = +faker.commerce.price(1, 100)

    ImportMock.mockFunction(bookService, "createBook", "Bad request")

    const resp = await app.inject({
      method: "POST",
      url: "/book/",
      payload: { authorId, price },
    })

    expect(resp.statusCode).toStrictEqual(400)
    expect(resp.body).toStrictEqual("body must have required property 'title'")
  })

  it("should reject book with invalid price", async () => {
    const authorId = +faker.random.numeric(6)
    const title = faker.random.words(3)
    const price = +faker.commerce.price(1, 100) * -1

    ImportMock.mockFunction(bookService, "createBook", "Bad request")

    const resp = await app.inject({
      method: "POST",
      url: "/book/",
      payload: { title, authorId, price },
    })

    expect(resp.statusCode).toStrictEqual(400)
    expect(resp.body).toStrictEqual("body/price must be > 0")
  })
})
