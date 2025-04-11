const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/bookRoutes.js', './routes/publisherRoutes.js', './routes/authRoutes.js']; // Include authRoutes

const doc = {
  info: {
    title: 'Book Store API',
    description: 'API documentation for the Book Store application.',
  },
  host: 'bookstore-s1zp.onrender.com', // Replace with your host
  schemes: ['https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT Authorization header using the Bearer scheme.',
    },
  },
  definitions: { // Define your schemas here
    Book: {
      type: 'object',
      required: [
        'title',
        'author',
        'isbn',
        'publicationDate',
        'genre',
        'description',
        'pdfFile',
        'publisher',
        'pageCount',
      ],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        publicationDate: { type: 'string', format: 'date' },
        genre: { type: 'string' },
        description: { type: 'string' },
        pdfFile: { type: 'string' },
        publisher: { type: 'string' },
        pageCount: { type: 'integer', minimum: 1 },
      },
    },
      Publisher: {
      type: 'object',
      required: ['firstName', 'email', 'username', 'password'],
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        books: { type: 'array', items: { type: 'object' } },
      },
    },
     Login: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc)