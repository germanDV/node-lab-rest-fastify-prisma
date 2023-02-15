# NODE LAB

REST API built with:

- Fastify -> server framework.
- Prisma -> ORM, using postgresql.
- Zod -> validation, schemas inferred from Prisma models.
- Redis -> caching of API responses.
- Swagger -> to document API.
- Jest -> to test it.
- Docker Compose -> to spin up all services.

## Run It

Run `docker compose up` to get things started. Navigate to `http://localhost:3333/docs`, you'll find the docs and will be able to make requests to the server.

During development, you may want to run the server in development mode, we could do that syncing our local folder to the one in the Docker container, but for now, I find it easier and faster to simply spin another instance of the server on a different port. Run `PORT=3334 yarn dev` and you can make requests to `http://localhost:3334` instead of `http://localhost:3333`, for example: `http://localhost:3334/docs`.

## Tests

Tests need _postgres_ and _redis_ to be running, so make sure to run `docker compose up` before `yarn test`.
