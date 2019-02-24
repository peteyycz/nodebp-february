const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType
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

const UserField = new GraphQLEnumType({
  name: "CategoryField",
  values: {
    firstName: { value: "firstName" },
    lastName: { value: "lastName" }
  }
});

const FilterOperation = new GraphQLEnumType({
  name: "FilterOperation",
  values: {
    eq: { value: "eq", description: "Field must be equal to value." },
    like: { value: "like", description: "Field contain the value." }
  }
});

const UserFilterType = new GraphQLInputObjectType({
  name: "UserFilterType",
  fields: {
    value: { type: GraphQLString },
    field: { type: UserField },
    operation: { type: FilterOperation }
  }
});

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const UserInputType = new GraphQLInputObjectType({
  name: "UserInputType",
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
      args: {
        filter: { type: UserFilterType }
      },
      resolve: (_, { filter }) => {
        console.log(filter); // For demonstration purposes
        return users.filter((user) => {
          if (!filter) {
            return true;
          }
          const lefthand = user[filter.field];
          switch (filter.operation) {
            case "eq": {
              return lefthand.toLowerCase() === filter.value.toLowerCase();
            }
            case "like": {
              return lefthand.toLowerCase().includes(filter.value.toLowerCase());
            }
            default:
              return true;
          }
        });
        return users;
      }
    }
  }
});

const mutationType = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    createUser: {
      type: User,
      args: {
        input: { type: UserInputType }
      },
      resolve(_, args) {
        users.push(args.input);
        return args.input;
      }
    }
  }
});

const schema = new GraphQLSchema({
  types: [User],
  query: queryType,
  mutation: mutationType
});

module.exports = schema;
