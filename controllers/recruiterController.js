/* eslint-disable no-undef */
const { body, validationResult } = require('express-validator');
const publisherModel = require('../models/publisherModel');
const utilities= require('../utilities');
const Book = require('../models/bookModel');
const bcrypt = require('bcryptjs');

// Publishers
const getPublishers =  async (req, res) => {
    try {
      
        const publishers = await publisherModel.find();
        res.setHeader('Content-Type', 'application/json');
        res.json(publishers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPublisherById =  async (req, res) => {
    try {
        
        const publisher = await publisherModel.findById(req.params.id);
        if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
        res.setHeader('Content-Type', 'application/json');
        res.json(publisher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Assuming you have your bookSchema and publisherModel defined elsewhere

const getPublisherByIdWithBooks = async (req, res) => {
    try {
     
        const publisher = await publisherModel.findById(req.params.id);

      

        if (!publisher) {
            return res.status(404).json({ message: 'Publisher not found' });
        }

        const books = await Book.find({ publisher: req.params.id });
        if (books) {
             publisher.books = books; // Attach the books to the publisher object
        }
      

        res.setHeader('Content-Type', 'application/json');
        res.json(publisher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addPublisherValidationRules = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('email').notEmpty().withMessage('Email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').notEmpty().withMessage('Password is required'),
];


const addPublisher =  async (req, res) => {

     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
     
     
   
    
    try {
          const hash = await bcrypt.hash(req.body.password, 10)
     const publisher =  new publisherModel({firstName: req.body.firstName,
        lastName: req.body.lastName,
        email : req.body.email,
        phone: req.body.phone,
        username : req.body.username,
        password : hash
        });
        const newPublisher = await publisher.save();
        if(newPublisher){
             res.status(201).json(newPublisher);
        }else{
            res.status(400).json({ message: 'Publisher not created' });
        }
       
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const updatePublisherValidationRules = [
    body('firstName').optional().notEmpty().withMessage('First name is required'),
    body('email').optional().isEmail().withMessage('Email must be a valid email address'),
    body('email').optional().notEmpty().withMessage('Email is required'),
    body('username').optional().notEmpty().withMessage('Username is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').optional().notEmpty().withMessage('Password is required'),
];

const updatePublisher =  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
         
        const updatedPublisher = await publisherModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPublisher) return res.status(404).json({ message: 'Publisher not found' });
        res.json(updatedPublisher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deletePublisher = async (req, res) => {
    try {
         
        const deletedPublisher = await publisherModel.findByIdAndDelete(req.params.id);
        if (!deletedPublisher) return res.status(404).json({ message: 'Publisher not found' });
        res.json({ message: 'Publisher deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getPublishers,
    getPublisherById,
    addPublisher,
    updatePublisher,
    deletePublisher,
    getPublisherByIdWithBooks,
    updatePublisherValidationRules,
    addPublisherValidationRules
};

