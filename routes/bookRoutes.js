/* eslint-disable no-undef */
const bookRouter = require('express').Router();
const controller = require('../controllers/bookController');
const auth = require('../middleware/auth'); // Import the auth middleware

/**
 * @swagger
 * /books:
 * get:
 * summary: Get all books
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: The books found
 */
bookRouter.get('/', auth, controller.getBooks);

/**
 * @swagger
 * /books/{id}:
 * get:
 * summary: Get a book by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: The book object
 */
bookRouter.get('/:id', auth, controller.getBookById);

/**
 * @swagger
 * /books:
 * post:
 * summary: Create a new book
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/definitions/Book'
 * responses:
 * 201:
 * description: The created book
 */
bookRouter.post('/', auth, controller.addBookValidationRules, controller.addBook);

/**
 * @swagger
 * /books/{id}:
 * put:
 * summary: Update a book by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/definitions/Book'
 * responses:
 * 200:
 * description: The updated book
 */
bookRouter.put('/:id', auth, controller.updateBookValidationRules, controller.updateBook);

/**
 * @swagger
 * /books/{id}:
 * delete:
 * summary: Delete a book by ID
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Book deleted
 */
bookRouter.delete('/:id', auth, controller.deleteBook);

module.exports = bookRouter