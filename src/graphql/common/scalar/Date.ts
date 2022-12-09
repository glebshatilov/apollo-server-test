import { GraphQLScalarType, Kind } from 'graphql'
// import {Date} from "neo4j-driver";

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date format in ISO.',
  serialize(value: string | Date) {
    const date = new Date(value)

    return date.toISOString()
  },
  parseValue(value: string) {
    return new Date(value).toISOString()
  },
  // parseLiteral(ast) {
  //   if (ast.kind === Kind.STRING) {
  //     // Convert hard-coded AST string to integer and then to Date
  //     return new Date(ast)
  //   }
  //   // Invalid hard-coded value (not an integer)
  //   return null;
  // }
})

export default dateScalar
