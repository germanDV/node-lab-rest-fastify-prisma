export function createRedisKeyGenerator(prefix: string): (v: string | number) => string {
  return (value: string | number): string => `${prefix}:${value}`
}
