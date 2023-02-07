import Fastify, { FastifyInstance } from "fastify"
import bookRoutes from "./rest/books"

const fastify: FastifyInstance = Fastify({ logger: true })

fastify.route({
  method: "GET",
  url: "/",
  preHandler: async (_req, _res) => {
    fastify.log.info("Do some validation here.")
  },
  handler: async (_req, _res) => {
    return { msg: "Welcome to books API!" }
  },
})

fastify.register(bookRoutes)

async function start() {
  try {
    await fastify.listen({ port: 3333 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
