import { FastifyInstance, FastifyRequest } from "fastify"

async function bookRoutes(fastify: FastifyInstance, _options: object) {
  fastify.route({
    method: "GET",
    url: "/book",
    handler: async (_req, _res) => {
      return { books: "WIP" }
    },
  })

  fastify.route<{ Params: { id: string } }>({
    method: "GET",
    url: "/book/:id",
    handler: async (req, _res) => {
      const { id } = req.params
      return { book: { id, title: "Lorem ipsum dolor" } }
    },
  })

  fastify.route({
    method: "POST",
    url: "/book",
    preHandler: async (req) => {
      // validate body with zod
      console.log(req.body)
    },
    handler: async () => {
      return { msg: "WIP" }
    },
  })
}

export default bookRoutes
