/* eslint-disable no-undef */

const Applicant = require('../models/applicantModel');
const Application= require('../models/applicationModel');
// eslint-disable-next-line no-unused-vars
const express = require('express');

const utilities= require('../utilities');
const { body, validationResult } = require('express-validator');
// Books

const getApplications = async (req, res) => {
  try {
    
    const applications = await Application.find();
    res.setHeader('Content-Type', 'application/json');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    
    const applications = await Applicant.find();
    res.setHeader('Content-Type', 'application/json');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getApplicationById = async (req, res) => {
  try {
    
    const applications = await Application.f.findById(req.params.id);
     if (!applications) return res.status(404).json({ message: 'application not found' });
    res.setHeader('Content-Type', 'application/json');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const addBookValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('publicationDate').notEmpty().isISO8601().withMessage('Publication date is required and must be a valid date'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('pdfFile').notEmpty().withMessage('PDF file is required'),
    body('publisher').notEmpty().withMessage('Publisher is required'),
    body('pageCount').isInt({ min: 1 }).withMessage('Page count must be a positive integer'),
];
const addApplicationValidationRules = [
    body('language').notEmpty().withMessage('Language is required'),
      body('skill').notEmpty().withMessage('Language is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').notEmpty().withMessage('Password is required'),
];

const updteApplicationValidationRules = [
    body('language').optional().notEmpty().withMessage('Language is required'),
      body('skill').optional().notEmpty().withMessage('Language is required'),
    body('email').optional().isEmail().withMessage('Email must be a valid email address'),
    body('email').optional().notEmpty().withMessage('Email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').optional().notEmpty().withMessage('Password is required'),
];

 const addApplication = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
 
 
  try {
    const application = new Application(req.body);
    const  newApplication = await application.save();
   
   if (!newApplication) return res.status(400).json({ message: 'Application not created' });

    
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



const updateBookValidationRules = [
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('author').optional().notEmpty().withMessage('Author is required'),
    body('isbn').optional().notEmpty().withMessage('ISBN is required'),
    body('publicationDate').optional().isISO8601().withMessage('Publication date is required and must be a valid date'),
    body('genre').optional().notEmpty().withMessage('Genre is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('pdfFile').optional().notEmpty().withMessage('PDF file is required'),
    body('publisher').optional().notEmpty().withMessage('Publisher is required'),
    body('pageCount').optional().isInt({ min: 1 }).withMessage('Page count must be a positive integer'),
];
 const updateApplication = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
       
        const updateApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateApplication) return res.status(404).json({ message: 'Application not found' });
        res.json(updateApplication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



const deleteBook= async (req, res) => {
    try {
      
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    addBookValidationRules,
    updateBookValidationRules,

};