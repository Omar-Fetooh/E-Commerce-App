import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    description: "just testing a root Query ",
    fields: {
      sayHello: {
        type: GraphQLString,
        name: "sayHello",
        description: "say Hello query",
        resolve: () => {
          return "Hello World";
        },
      },
      returnBoolean: {
        type: GraphQLBoolean,
        name: "returnBoolean",
        description: "A simple boolean query",
        resolve: () => {
          return true;
        },
      },
      returnObject: {
        name: "returnObject",
        description: "returnObject query",
        type: new GraphQLObjectType({
          name: "returnObjectType",
          description: "a simple object type",
          fields: {
            message: { type: GraphQLString },
            statusCode: { type: GraphQLInt },
          },
        }),
        resolve: () => {
          return {
            message: "Hello again",
            statusCode: 200,
          };
        },
      },
      sendData: {
        name: "sendData",
        description: "a simple query to send data",
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
          age: { type: GraphQLFloat },
        },

        resolve: (parent, args) => {
          console.log(args);
          return `hello ${args.name}`;
        },
      },
    },
  }),
});
