import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const RangedInt = (min = 0, max = 50): GraphQLScalarType =>
  new GraphQLScalarType({
    name: 'RangedInt',
    description: 'An integer with a max and min value',
    serialize: (value: number) => value,
    parseValue: (value: number) => value,
    parseLiteral: (ast) => {
      switch (ast.kind) {
        case Kind.INT: {
          const parsedLimit = Number.parseInt(ast.value, 10);
          if (parsedLimit < min) {
            throw new GraphQLError(`Minimum value for "RangedInt" is ${min}.`, [ast]);
          }
          if (parsedLimit > max) {
            throw new GraphQLError(`Maximum value for "RangedInt" is ${max}.`, [ast]);
          }
          break;
        }
        default:
          throw new GraphQLError(`Query error: Can only parse Int got a: ${ast.kind}.`, [ast]);
      }
    },
  });
export default RangedInt;
