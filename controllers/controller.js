const Applicant = require('../models/applicantModel');
const Application = require('../models/applicationModel');
const Recruiter = require('../models/recruiterModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require("dotenv").config();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// eslint-disable-next-line no-unused-vars
const express = require('express');

const utilities = require('../utilities');
const { body, validationResult } = require('express-validator');

let profilePath = null; // Initialize profilePath variable
let githubRepository = "https://github.com/MarcelMusuyu/Talented_JobMarket_API/blob/main/uploads/"; // Corrected GitHub URL for file access
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

// Configure Multer for local file storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads'; // Default folder
        if (file.fieldname === 'profile') {
            folder = 'uploads'; // Profile folder
            profilePath = path.join(__dirname,'..', folder); // Store the local profile path
        }
        
        const uploadPath = path.join(__dirname,'..', folder);

            // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists

        cb(null, uploadPath); // Set the destination directory
        
    },
    filename: function (req, file, cb) {
        const { email } = req.body;
        const fileExtension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExtension);
        const newFilename = `${email}_${file.fieldname}${fileExtension}`;
        profilePath = path.join(githubRepository, newFilename); // Set the GitHub URL for the uploaded file
        cb(null, newFilename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // Added image types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and DOCX files are allowed.'), false); // Updated error message
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});


const addUserValidationRules = [
    body('type_user').notEmpty().withMessage('The user type is required'),
    body('firstname').notEmpty().withMessage('Firstname is required'),
    body('lastname').notEmpty().withMessage('Lastname is required'),
    body('type_user').notEmpty().withMessage('User Type name is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('email').notEmpty().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('password').notEmpty().withMessage('Password is required'),
    body('profile').notEmpty().withMessage('Profile is required'),
];


const addUser = async (req, res) => {
  console.log(req.body);
  let userprofilePath = null; // Initialize local profile path
  let newUser = null;

  
    // Get the determined profile path (GitHub URL)
    userprofilePath = profilePath;
    if(!req.body.profile ){
        req.body.profile = userprofilePath;
    }
    console.log(req.body);
    const errors = validationResult(req.body);
    
    console.log(errors.array());
     if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });                                                                                                                                                                                                                                                                                                                                                                                            
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    try {
      if (req.body.type_user === 'candidate') {
        const candidate = new Applicant({
         type_user:req.body.type_user,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
           profile: userprofilePath,
        });
        newUser = await candidate.save();
      } else if (req.body.type_user === 'recruiter') {
        const recruiter = new Recruiter({
          type_user:req.body.type_user,   
          enterprise: req.body.firstname,
          type: req.body.lastname,
          email: req.body.email,
          password: hash,
          profile: userprofilePath,
        });
        newUser = await recruiter.save();
      }

      if (!newUser)
        return res.status(400).json({ message: 'User not created' });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }



const getUserByEmail = async (req, res) => {
    let user = null;
    try {
        const { email, password } = req.body;
        user = await Applicant.findOne({ email });
        if (!user) {
            user = await Recruiter.findOne({ email });
            if (!user) return null;
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return null;
            }
            return user;
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return null;
            }
            return user;
        }


    } catch (err) {
        return null;
    }
};


const login = async (req, res) => {
    // const { email, password } = req.body;
    try {
        const user = await getUserByEmail(req, res);
        let userType = null;
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (user.enterprise) {
            userType = 'recruiter';
        }else if (user.firstname) {
            userType = 'candidate';
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }
        const payload = {
            user: {
                id: user.id,
                role: userType
            },
        };
       
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.header('Authorization', `Bearer ${token}`).json({ message: 'Login successful', token:token,user:payload.user});
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAllCandidates = async (req, res) => {
    try {
        const users = await Applicant.find();
        res.setHeader('Content-Type', 'application/json');

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getCandidateById,
    addUserValidationRules,
    addUser,
    getUserByEmail,
    login,
    getAllCandidates,
    upload,
};