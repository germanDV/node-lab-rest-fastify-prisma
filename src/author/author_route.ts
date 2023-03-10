import { FastifyInstance } from "fastify"
import { createAuthor, deleteAuthor, getAuthorById, getAuthors } from "./author_service"
import { Schemas, AuthorInput } from "./author_schema"
import { setDataSourceHeader, createRedisKeyGenerator, env } from "../utils"

async function authorRoutes(fastify: FastifyInstance, _options: object) {
  const TTL = env("redisTTL")
  const generateKey = createRedisKeyGenerator("AUTHOR")

  fastify.route<{ Querystring: { page: number; perPage: number } }>({
    method: "GET",
    url: "/",
    schema: {
      description: "Get a list of all authors in the library",
      tags: ["author"],
      querystring: {
        type: "object",
        properties: {
          page: { type: "number" },
          perPage: { type: "number" },
        },
      },
      response: {
        200: { type: "array", items: { $ref: `${Schemas.AUTHOR_BOOKS}#` } },
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
      const authors = await getAuthors(page, perPage)
      setDataSourceHeader(res, "database")
      fastify.redis.setex(
        generateKey(`?page=${page}&perPage=${perPage}`),
        TTL,
        JSON.stringify(authors)
      )
      return authors
    },
  })

  fastify.route<{ Params: { id: number } }>({
    method: "GET",
    url: "/:id",
    schema: {
      description: "Find author by it's ID",
      tags: ["author"],
      params: { $ref: `${Schemas.AUTHOR_ID}#` },
      response: {
        200: { $ref: `${Schemas.AUTHOR_BOOKS}#` },
      },
    },
    preHandler: async (req, res) => {
      const authorId = req.params.id
      const author = await fastify.redis.get(generateKey(authorId))
      if (author) {
        setDataSourceHeader(res, "cache")
        res.send(JSON.parse(author))
      }
    },
    handler: async (req, res) => {
      const authorId = req.params.id
      const author = await getAuthorById(authorId)
      if (author) {
        setDataSourceHeader(res, "database")
        fastify.redis.setex(generateKey(authorId), TTL, JSON.stringify(author))
        return author
      } else {
        res.status(404).send(`Author ${authorId} not found`)
      }
    },
  })

  fastify.route<{ Body: AuthorInput }>({
    method: "POST",
    url: "/",
    schema: {
      description: "Create a new author in the system",
      tags: ["author"],
      body: { $ref: `${Schemas.AUTHOR_INPUT}#` },
      response: {
        201: { $ref: `${Schemas.AUTHOR}#` },
      },
    },
    handler: async (req, res) => {
      const author = await createAuthor(req.body)
      res.status(201)
      return author
    },
  })

  fastify.route<{ Params: { id: number } }>({
    method: "DELETE",
    url: "/:id",
    schema: {
      description: "Delete an author by it's ID (deletes all related books as well)",
      tags: ["author"],
      params: { $ref: `${Schemas.AUTHOR_ID}#` },
      response: {
        200: { $ref: `${Schemas.AUTHOR}#` },
      },
    },
    handler: async (req) => {
      const authorId = req.params.id
      await fastify.redis.del(generateKey(authorId))
      return deleteAuthor(authorId)
    },
  })
}

export default authorRoutes
