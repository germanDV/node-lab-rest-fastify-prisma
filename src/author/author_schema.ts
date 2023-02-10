import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { AuthorModel, BookModel } from "../models"

const authorId = AuthorModel.pick({ id: true })
const authorInput = AuthorModel.pick({ firstName: true, middleName: true, lastName: true })
const authorWithBooks = AuthorModel.merge(z.object({ books: z.array(BookModel) }))

export enum Schemas {
  AUTHOR_ID = "AuthorId",
  AUTHOR_INPUT = "AuthorInput",
  AUTHOR = "Author",
  AUTHOR_BOOKS = "AuthorWithBooks",
}

export type AuthorInput = z.infer<typeof authorInput>

export const authorIdJsonSchema = zodToJsonSchema(authorId, Schemas.AUTHOR_ID)
export const authorInputJsonSchema = zodToJsonSchema(authorInput, Schemas.AUTHOR_INPUT)
export const authorJsonSchema = zodToJsonSchema(AuthorModel, Schemas.AUTHOR)
export const authorWithBooksJsonSchema = zodToJsonSchema(authorWithBooks, Schemas.AUTHOR_BOOKS)
