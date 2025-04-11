/* eslint-disable no-undef */
const basicRouter = require('express').Router(); // Changed to basicRouter
const controller = require('../controllers/bookController');

// const publisherRouter = require('express').Router(); // Changed to publisherRouter
const controllerPublisher = require('../controllers/publisherController');



basicRouter.get('books/', controller.getBooks);


basicRouter.get('books/:id', controller.getBookById);

basicRouter.post('books/', controller.addBookValidationRules, controller.addBook);

basicRouter.put('books/:id', controller.updateBookValidationRules, controller.updateBook);


basicRouter.delete('books/:id', controller.deleteBook);
/* eslint-disable no-undef */


basicRouter.get('/publishers/', controllerPublisher.getPublishers);

basicRouter.get('/publishers/:id/books', controllerPublisher.getPublisherByIdWithBooks);


basicRouter.get('/publishers/:id', controllerPublisher.getPublisherById);

basicRouter.post('/publishers/', controllerPublisher.addPublisherValidationRules, controllerPublisher.addPublisher);


basicRouter.put('/publishers/:id', controllerPublisher.updatePublisherValidationRules, controllerPublisher.updatePublisher);


basicRouter.delete('/publishers/:id', controllerPublisher.deletePublisher);

module.exports = basicRouter; // Export basicRouter

