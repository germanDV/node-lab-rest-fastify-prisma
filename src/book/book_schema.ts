import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { AuthorOptionalDefaultsSchema, BookSchema, BookOptionalDefaultsSchema } from "../models"

const bookId = BookSchema.pick({ id: true })
const bookInput = BookOptionalDefaultsSchema.pick({ title: true, authorId: true, price: true })
const bookWithAuthor = BookSchema.omit({ authorId: true }).merge(
  z.object({ author: AuthorOptionalDefaultsSchema })
)

export enum Schemas {
  BOOK_ID = "BookId",
  BOOK_INPUT = "BookInput",
  BOOK = "Book",
  BOOK_AUTHOR = "BookWithAuthor",
}

export type BookInput = z.infer<typeof bookInput>

export const bookIdJsonSchema = zodToJsonSchema(bookId, Schemas.BOOK_ID)
export const bookInputJsonSchema = zodToJsonSchema(bookInput, Schemas.BOOK_INPUT)
export const bookJsonSchema = zodToJsonSchema(BookSchema, Schemas.BOOK)
export const bookWithAuthorJsonSchema = zodToJsonSchema(bookWithAuthor, Schemas.BOOK_AUTHOR)
