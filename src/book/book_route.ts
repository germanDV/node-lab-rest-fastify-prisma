import { FastifyInstance } from "fastify"
import { getBooks, getBookById, createBook } from "./book_service"
import { Schemas, BookInput } from "./book_schema"
import { setDataSourceHeader, createRedisKeyGenerator, env } from "../utils"

const TTL = env("redisTTL")
const generateKey = createRedisKeyGenerator("BOOK")

async function bookRoutes(fastify: FastifyInstance, _options: object) {
  fastify.route<{ Querystring: { page: number; perPage: number } }>({
    method: "GET",
    url: "/",
    schema: {
      description: "Get a list of all books in the library",
      tags: ["book"],
      response: {
        200: { type: "array", items: { $ref: `${Schemas.BOOK_AUTHOR}#` } },
      },
    },
    preHandler: async (req, res) => {
      const page = Number(req.query.page) || 1
      const perPage = Number(req.query.perPage) || 25
      const data = await fastify.redis.get(generateKey(`?page=${page}&perPage=${perPage}`))
      if (data) {
        setDataSourceHeader(res, "cache")
        res.send(JSON.parse(data))
      }
    },
    handler: async (req, res) => {
      const page = Number(req.query.page) || 1
      const perPage = Number(req.query.perPage) || 25
      const books = await getBooks(page, perPage)
      setDataSourceHeader(res, "database")
      fastify.redis.setex(
        generateKey(`?page=${page}&perPage=${perPage}`),
        TTL,
        JSON.stringify(books)
      )
      return books
    },
  })

  fastify.route<{ Params: { id: number } }>({
    method: "GET",
    url: "/:id",
    schema: {
      description: "Find book by it's ID",
      tags: ["book"],
      params: { $ref: `${Schemas.BOOK_ID}#` },
      response: {
        200: { $ref: `${Schemas.BOOK_AUTHOR}#` },
      },
    },
    preHandler: async (req, res) => {
      const bookId = req.params.id
      const book = await fastify.redis.get(generateKey(bookId))
      if (book) {
        setDataSourceHeader(res, "cache")
        res.send(JSON.parse(book))
      }
    },
    handler: async (req, res) => {
      const bookId = req.params.id
      const book = await getBookById(bookId)
      if (book) {
        setDataSourceHeader(res, "database")
        fastify.redis.setex(generateKey(bookId), TTL, JSON.stringify(book))
        return book
      } else {
        res.status(404).send(`Book ${bookId} not found`)
      }
    },
  })

  fastify.route<{ Body: BookInput }>({
    method: "POST",
    url: "/",
    schema: {
      description: "Create a new book in the system",
      tags: ["book"],
      body: { $ref: `${Schemas.BOOK_INPUT}#` },
      response: {
        201: { $ref: `${Schemas.BOOK}#` },
      },
    },
    handler: async (req, res) => {
      const book = await createBook(req.body)
      res.status(201)
      return book
    },
  })
}

export default bookRoutes
