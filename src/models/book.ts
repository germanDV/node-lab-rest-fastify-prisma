import * as z from "zod"
import { CompleteAuthor, RelatedAuthorModel } from "./index"

export const BookModel = z.object({
  id: z.number().int(),
  title: z.string().trim().min(1).max(256),
  price: z.number().positive(),
  createdAt: z.date(),
  authorId: z.number().int(),
})

export interface CompleteBook extends z.infer<typeof BookModel> {
  author: CompleteAuthor
}

/**
 * RelatedBookModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedBookModel: z.ZodSchema<CompleteBook> = z.lazy(() => BookModel.extend({
  author: RelatedAuthorModel,
}))
