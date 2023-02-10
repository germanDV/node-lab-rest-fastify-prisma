import type { FastifyReply } from "fastify"

const KEY = "x-data-source"

export function setDataSourceHeader(res: FastifyReply, source: string) {
  res.header(KEY, source)
}
