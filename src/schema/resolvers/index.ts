import { queryResolvers } from './queries';
import { mutationResolvers } from './mutations';

export * from './validator';
export * from './crypto.utils';
export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
