import { z } from 'zod';
import { type Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AuthorScalarFieldEnumSchema = z.enum(['id','firstName','middleName','lastName']);

export const BookScalarFieldEnumSchema = z.enum(['id','title','price','createdAt','authorId']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

// AUTHOR
//------------------------------------------------------


export const AuthorSchema = z.object({
  id: z.number().int(),
  firstName: z.string().min(1).max(100),
  middleName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
})

export type Author = z.infer<typeof AuthorSchema>

export const AuthorOptionalDefaultsSchema = AuthorSchema.merge(z.object({
  id: z.number().int().optional(),
  middleName: z.string().min(1).max(100).optional(),
}))

// BOOK
//------------------------------------------------------


export const BookSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1).max(256),
  price: z.number().positive(),
  createdAt: z.coerce.date(),
  authorId: z.number().int(),
})

export type Book = z.infer<typeof BookSchema>

export const BookOptionalDefaultsSchema = BookSchema.merge(z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
}))
