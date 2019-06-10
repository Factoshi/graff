import { QueryResolvers } from "../../types/resolvers";

export const Query: QueryResolvers = {
    adminBlock: (_, { hash }) => ({ hash })
}

