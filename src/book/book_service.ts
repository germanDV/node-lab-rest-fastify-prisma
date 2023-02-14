import { BookInput } from "./book_schema"
import prisma from "../prisma"

export async function createBook(data: BookInput) {
  return prisma.book.create({ data })
}

export async function getBooks(page: number, perPage: number) {
  return prisma.book.findMany({
    orderBy: { id: "asc" },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { author: true },
  })
}

export async function getBookById(id: number) {
  return prisma.book.findFirst({ where: { id }, include: { author: true } })
}

export async function deleteBook(id: number) {
  return prisma.book.delete({ where: { id } })
}
