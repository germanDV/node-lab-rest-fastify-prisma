import type { FastifyInstance } from "fastify"
import {
  bookIdJsonSchema,
  bookInputJsonSchema,
  bookWithAuthorJsonSchema,
  bookJsonSchema,
  Schemas as BookSchemas,
} from "../book/book_schema"
import {
  authorIdJsonSchema,
  authorInputJsonSchema,
  authorWithBooksJsonSchema,
  authorJsonSchema,
  Schemas as AuthorSchemas,
} from "../author/author_schema"

export function registerSchemas(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: BookSchemas.BOOK_ID,
    ...bookIdJsonSchema.definitions![BookSchemas.BOOK_ID],
  })
  fastify.addSchema({
    $id: BookSchemas.BOOK_INPUT,
    ...bookInputJsonSchema.definitions![BookSchemas.BOOK_INPUT],
  })
  fastify.addSchema({
    $id: BookSchemas.BOOK,
    ...bookJsonSchema.definitions![BookSchemas.BOOK],
  })
  fastify.addSchema({
    $id: BookSchemas.BOOK_AUTHOR,
    ...bookWithAuthorJsonSchema.definitions![BookSchemas.BOOK_AUTHOR],
  })
  fastify.addSchema({
    $id: AuthorSchemas.AUTHOR_ID,
    ...authorIdJsonSchema.definitions![AuthorSchemas.AUTHOR_ID],
  })
  fastify.addSchema({
    $id: AuthorSchemas.AUTHOR_INPUT,
    ...authorInputJsonSchema.definitions![AuthorSchemas.AUTHOR_INPUT],
  })
  fastify.addSchema({
    $id: AuthorSchemas.AUTHOR,
    ...authorJsonSchema.definitions![AuthorSchemas.AUTHOR],
  })
  fastify.addSchema({
    $id: AuthorSchemas.AUTHOR_BOOKS,
    ...authorWithBooksJsonSchema.definitions![AuthorSchemas.AUTHOR_BOOKS],
  })
}
