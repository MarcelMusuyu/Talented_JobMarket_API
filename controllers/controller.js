const Applicant = require('../models/applicantModel');
const Application= require('../models/applicationModel');
const Recruiter= require('../models/recruiterModel');
// eslint-disable-next-line no-unused-vars
const express = require('express');

const utilities= require('../utilities');
const { body, validationResult } = require('express-validator');


const getCandidateById = async (req, res) => {
  try {
    
    const applications = await Applicant.findById(req.params.id);
     if (!applications) return res.status(404).json({ message: 'Candidate not found' });
    res.setHeader('Content-Type', 'application/json');
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addUserValidationRules = [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
     body('type_user').notEmpty().withMessage('User Type name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('email').notEmpty().withMessage('Email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').notEmpty().withMessage('Password is required'),
];
 const addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let newUser=null; 
  try {
    if( req.body.type_user === 'candidate'){
        const application = new Application(req.body);
      newUser = await application.save();
    }else{
        const recruiter = new Recruiter(req.body);
        newUser = await recruiter.save();
    }

    
   
   if (!newUser) return res.status(400).json({ message: 'User not created' });

    
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
