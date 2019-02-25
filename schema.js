const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLID
} = require("graphql");

const users = [
  {
    id: "0",
    firstName: "Ferenc",
    lastName: "Frontend",
    email: "ferenc.frontend@amazingcompany.com",
    friends: ["1"]
  },
  {
    id: "1",
    firstName: "Bela",
    lastName: "Backend",
    email: "bela.backend@amazingcompany.com",
    friends: ["2"]
  },
  {
    id: "2",
    firstName: "Peter",
    lastName: "Czibik",
    email: "peter.czibik@risingstack.com",
    friends: []
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
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    friends: {
      type: new GraphQLList(FriendEdge),
      resolve(source) {
        return source.friends.map((friendId) => {
          const user = users.find(({ id: userId }) => userId === friendId);
          console.log(friendId);
          console.log("user", user);
          return {
            node: user
          };
        });
      }
    }
  })
});

const FriendEdge = new GraphQLObjectType({
  name: "FriendEdge",
  fields: {
    node: { type: User }
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
        const newUser = Object.assign(args.input, { id: users.length.toString(), friends: ["2"] }); // Already a friend of mine <3 :D
        console.log(newUser);
        users.push(newUser);
        return newUser;
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
