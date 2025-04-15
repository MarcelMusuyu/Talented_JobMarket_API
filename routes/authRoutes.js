const express = require('express');
const router = express.Router();
const userController = require('../controllers/controller');
const auth = require('../middleware/auth'); // Optional: for protecting routes

// --- Applicant/Recruiter Registration and Login ---

// POST register a new user (applicant or recruiter)
router.post('/register',userController.upload.single('profile'),
    userController.addUserValidationRules,
    // Middleware for handling profile image upload
    userController.addUser
);

// POST login user
router.post('/login', userController.login);

// --- Applicant Specific Routes ---

// GET applicant by ID (protected route - requires authentication)
router.get('/candidates/:id',
    auth, 
    userController.getCandidateById
);

// GET all candidates (protected route - requires authentication)
router.get('/candidates',
     auth, 
    userController.getAllCandidates
);

// --- Recruiter Specific Routes (if you want separate recruiter retrieval) ---
// You might want to create a separate recruiter controller for more specific actions
// router.get('/recruiters/:id', recruiterController.getRecruiterById);
// router.get('/recruiters', recruiterController.getAllRecruiters);

module.exports = router;