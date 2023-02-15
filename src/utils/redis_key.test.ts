import { describe, it, expect } from "@jest/globals"
import { faker } from "@faker-js/faker"
import { createRedisKeyGenerator } from "./redis_key"

describe("utils > redis key generator", () => {
  it("should return a generator with the correct prefix", () => {
    const prefix = "BOOK"
    const generator = createRedisKeyGenerator(prefix)

    const v1 = +faker.random.numeric(4)
    expect(generator(v1)).toStrictEqual(`${prefix}:${v1}`)

    const v2 = +faker.internet.url()
    expect(generator(v2)).toStrictEqual(`${prefix}:${v2}`)

    const v3 = +faker.commerce.product()
    expect(generator(v3)).toStrictEqual(`${prefix}:${v3}`)
  })
})
