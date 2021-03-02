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

const banners = [
  {
    id: 1,
    items: [1, 3]
  },
  {
    id: 2,
    items: [2, 3]
  },
  {
    id: 3,
    items: [1]
  }
]

const bannerItems = [
  {
    id: 1,
    images: [1, 2],
    type: 'default',
    title: 'Супер акция'
  },
  {
    id: 2,
    images: [3, 4],
    type: 'mini',
    title: 'Супер акция мини'
  },
  {
    id: 3,
    images: [5, 6],
    type: 'vertical'
  },
  {
    id: 4,
    images: [7,8],
    type: 'default'
  }
];

const images = [
  {
    id: 1,
    src: 'test1',
    width: 320,
    height: 320
  },
  {
    id: 2,
    src: 'test2',
    width: 320,
    height: 320
  },
  {
    id: 3,
    src: 'test3',
    width: 320,
    height: 320
  },
  {
    id: 4,
    src: 'test4',
    width: 320,
    height: 320
  },
  {
    id: 5,
    src: 'test5',
    width: 320,
    height: 320
  },
  {
    id: 6,
    src: 'test6',
    width: 320,
    height: 320
  },
  {
    id: 7,
    src: 'test7',
    width: 320,
    height: 320
  },
  {
    id: 8,
    src: 'test8',
    width: 320,
    height: 320
  }
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
    author: Person!
  }

  # An author has a name
#  type Author {
#    name: String!
#  }

  # Queries can fetch a list of libraries
  type Query {
    libraries: [Library]
    books(author: String): [Book]
    banner(id: ID!): Banner
  }

  type Banner {
    # как получать id департамента, чтобы получать баннер и данные именно для него?
    id: ID! # возможно стоит использовать местоположение
    items: [BannerItem!]
  }

  type BannerItem {
    id: ID!
    images: [Image!]
    type: String! # Указывает какого размера изображение и где должно располагаться ("default", "wide", "vertical", "mini")

    # возможно стоит вынести промо-акции в отдельный тип (PromoAction) и брать из него данные
    title: String # название промоакции связанной
    link: String # ссылка на которую ведёт баннер
    hash: String # сейчас используется для идентификации промо-акции
  }

  type Image {
    id: ID!
    src: String!
    width: Int
    height: Int
  }

  type Adult {
    name: String!
    work: String!
  }

  type Child {
    name: String!
    school: String!
  }

  union Person = Adult | Child
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    libraries() {
      return libraries;
    },
    books(parent, args, context, info) {
      return books.filter(book => args.author ? book.author === args.author : true)
    },
    banner(parent, args, context, info) {
      console.log('args', args)
      console.log('banners', banners)
      return banners.find(banner => banner.id === Number(args.id))
    }
  },
  Banner: {
    items(parent) {
      console.log('tst', parent)
      console.log('tst2', parent.items.map(item => bannerItems.find(bannerItem => bannerItem.id === item)))
      return parent.items.map(item => bannerItems.find(bannerItem => bannerItem.id === item))
    }
  },
  BannerItem: {
    images(parent) {
      return parent.images.map(imageId => images.find(dataImage => dataImage.id === imageId))
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
