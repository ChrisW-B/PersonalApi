import { GraphQLEnumType } from 'graphql/type';

const period = {
  name: 'period',
  description: 'The time period',
  type: new GraphQLEnumType({
    name: 'period',
    values: {
      overall: { value: 'overall' },
      week: { value: '7day' },
      month: { value: '1month' },
      threeMonth: { value: '3month' },
      sixMonth: { value: '6month' },
      year: { value: '12month' },
    },
  }),
};

export default period;
