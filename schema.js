const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} = require("graphql");

const users = [
  {
    firstName: "Ferenc",
    lastName: "Frontend",
    email: "ferenc.frontend@amazingcompany.com"
  },
  {
    firstName: "Bela",
    lastName: "Backend",
    email: "bela.backend@amazingcompany.com"
  }
];

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const queryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: () => {
        return users;
      }
    }
  }
});

const schema = new GraphQLSchema({
  types: [User],
  query: queryType
});

module.exports = schema;
