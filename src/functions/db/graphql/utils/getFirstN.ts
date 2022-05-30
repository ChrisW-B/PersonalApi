const getFirstN = <T>(array: T[], max: string | number = 0): T[] =>
  max ? array.slice(0, +max) : array;
export default getFirstN;
