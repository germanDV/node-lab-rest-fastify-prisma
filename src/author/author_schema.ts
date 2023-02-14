import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { AuthorSchema, AuthorOptionalDefaultsSchema, BookOptionalDefaultsSchema } from "../models"

const authorId = AuthorSchema.pick({ id: true })
const authorInput = AuthorOptionalDefaultsSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
})
const authorWithBooks = AuthorSchema.merge(z.object({ books: z.array(BookOptionalDefaultsSchema) }))

export enum Schemas {
  AUTHOR_ID = "AuthorId",
  AUTHOR_INPUT = "AuthorInput",
  AUTHOR = "Author",
  AUTHOR_BOOKS = "AuthorWithBooks",
}

export type AuthorInput = z.infer<typeof authorInput>

export const authorIdJsonSchema = zodToJsonSchema(authorId, Schemas.AUTHOR_ID)
export const authorInputJsonSchema = zodToJsonSchema(authorInput, Schemas.AUTHOR_INPUT)
export const authorJsonSchema = zodToJsonSchema(AuthorSchema, Schemas.AUTHOR)
export const authorWithBooksJsonSchema = zodToJsonSchema(authorWithBooks, Schemas.AUTHOR_BOOKS)
