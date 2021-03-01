const {ApolloServer, gql} = require('apollo-server');

const libraries = [
  {
    branch: 'downtown'
  },
  {
    branch: 'riverside'
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown'
  },
  {
    title: 'City of Glass 2',
    author: 'Paul Auster',
    branch: 'downtown'
  },
  {
    title: 'City of Glass 3',
    author: 'Paul Auster',
    branch: 'downtown'
  },
];

// The GraphQL schema
const typeDefs = gql`
  # A library has a branch and books
  type Library {
    branch: String!
    books: [Book!]
  }

  # A book has a title and author
  type Book {
    title: String!
    author: Author!
  }

  # An author has a name
  type Author {
    name: String!
  }

  # Queries can fetch a list of libraries
  type Query {
    libraries: [Library],
    books(author: String): [Book]
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    libraries() {

      // Return our hardcoded array of libraries
      return libraries;
    },
    books(parent, args, context, info) {
      console.log('parent', parent)
      console.log('args', args)
      // console.log('context', context)
      console.log('info', info)
      return books.filter(book => args.author ? book.author === args.author : true)
    }
  },
  Library: {
    books(parent) {

      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter(book => book.branch === parent.branch);
    }
  },
  Book: {

    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
