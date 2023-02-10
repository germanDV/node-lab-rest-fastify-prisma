import { AuthorInput } from "./author_schema"
import prisma from "../prisma"

export async function createAuthor(data: AuthorInput) {
  return prisma.author.create({ data })
}

export async function getAuthors(page: number, perPage: number) {
  return prisma.author.findMany({
    orderBy: { id: "asc" },
    skip: (page - 1) * perPage,
    take: perPage,
    include: { books: true },
  })
}

export async function getAuthorById(id: number) {
  return prisma.author.findFirst({ where: { id }, include: { books: true } })
}
