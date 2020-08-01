const getFirstN = <T>(max = 0, array: T[]): T[] => (max ? array.slice(0, max) : array);
export default getFirstN;
