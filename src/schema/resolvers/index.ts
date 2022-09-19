import { queryResolvers } from './queries';
import { mutationResolvers } from './mutations';

export * from './helper-functions';
export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
