const apolloServer = require("apollo-server");
const schema = require("./schema");

const { ApolloServer } = apolloServer;

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
