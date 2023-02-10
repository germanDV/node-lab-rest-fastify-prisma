import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"
import { AuthorModel, BookModel } from "../models"

const bookId = BookModel.pick({ id: true })
const bookInput = BookModel.pick({ title: true, authorId: true, price: true })
const bookWithAuthor = BookModel.omit({ authorId: true }).merge(z.object({ author: AuthorModel }))

export enum Schemas {
  BOOK_ID = "BookId",
  BOOK_INPUT = "BookInput",
  BOOK = "Book",
  BOOK_AUTHOR = "BookWithAuthor",
}

export type BookInput = z.infer<typeof bookInput>

export const bookIdJsonSchema = zodToJsonSchema(bookId, Schemas.BOOK_ID)
export const bookInputJsonSchema = zodToJsonSchema(bookInput, Schemas.BOOK_INPUT)
export const bookJsonSchema = zodToJsonSchema(BookModel, Schemas.BOOK)
export const bookWithAuthorJsonSchema = zodToJsonSchema(bookWithAuthor, Schemas.BOOK_AUTHOR)
