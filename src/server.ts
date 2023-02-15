import Fastify, { type FastifyInstance } from "fastify"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import cors from "@fastify/cors"
import fastifyRedis from "@fastify/redis"
import { populateAndValidateConfig, env, registerSchemas } from "./utils"
import bookRoutes from "./book/book_route"
import authorRoutes from "./author/author_route"
// @ts-ignore
import { version } from "../package.json"

async function registerSwaggerDocs(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    swagger: {
      host: `${env("host")}:${env("port")}`,
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      info: {
        title: "Bookstore API",
        description: "Documentation for the Bookstore microservice API.",
        version,
      },
    },
  })

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    staticCSP: true,
    uiConfig: {
      docExpansion: "full",
    },
    uiHooks: {
      onRequest: (_req, _res, next) => {
        next()
      },
      preHandler: (_req, _res, next) => {
        next()
      },
    },
  })
}

async function healthcheckRoute(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/healthcheck",
    schema: {
      response: {
        200: { type: "object", properties: { status: { type: "string" } } },
        500: { type: "string" },
      },
    },
    handler: async () => ({ status: "ok" }),
  })
}

function registerErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error, _req, res) => {
    fastify.log.error(error)
    let status = 500
    if (error.code === "P2025") {
      status = 404
    } else if (error.statusCode) {
      status = error.statusCode
    }
    res.status(status).send(error.message)
  })
}

export async function build(): Promise<FastifyInstance> {
  const fastify: FastifyInstance = Fastify({ logger: true })
  await fastify.register(cors)
  registerSchemas(fastify)
  await registerSwaggerDocs(fastify)
  registerErrorHandler(fastify)

  fastify.register(fastifyRedis, {
    host: env("redisHost"),
    port: env("redisPort"),
  })

  fastify
    .register(healthcheckRoute)
    .register(bookRoutes, { prefix: "/book" })
    .register(authorRoutes, { prefix: "/author" })

  return fastify
}

async function main() {
  try {
    populateAndValidateConfig()
    const app = await build()
    await app.listen({ host: env("host"), port: env("port") })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
main()
