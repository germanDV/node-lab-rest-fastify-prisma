import * as z from "zod"
import { CompleteBook, RelatedBookModel } from "./index"

export const AuthorModel = z.object({
  id: z.number().int(),
  firstName: z.string().trim().min(1).max(100),
  middleName: z.string().trim().min(1).max(100).optional().nullish(),
  lastName: z.string().trim().min(1).max(100),
})

export interface CompleteAuthor extends z.infer<typeof AuthorModel> {
  books: CompleteBook[]
}

/**
 * RelatedAuthorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAuthorModel: z.ZodSchema<CompleteAuthor> = z.lazy(() => AuthorModel.extend({
  books: RelatedBookModel.array(),
}))
