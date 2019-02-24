const { ApolloServer, gql } = require("apollo-server");

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

const typeDefs = gql`
  type User {
    firstName: String!
    lastName: String!
    email: String!
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => users
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
