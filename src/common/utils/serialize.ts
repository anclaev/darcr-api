export const serializeBigInt = (bigint: BigInt | number) => {
  const int = Number.parseInt(bigint.toString())
  return int ?? bigint.toString()
}
