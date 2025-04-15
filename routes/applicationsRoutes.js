const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth'); // Optional: for protecting routes

// --- Application Routes ---

// GET all applications (protected route - requires authentication)
router.get('/',
     authMiddleware, 
    applicationController.getApplications
);


// GET application by ID (protected route - requires authentication)
router.get('/:id',
     authMiddleware, 
    applicationController.getApplicationById
);

// POST a new application (protected route - requires authentication)
router.post('/',
    applicationController.upload.fields([
            { name: 'resume', maxCount: 1 },
            { name: 'coverLetter', maxCount: 1 },
            { name: 'transcript', maxCount: 1 },
        ]),

    authMiddleware,
   
    applicationController.addApplicationValidationRules,
    applicationController.addApplication
);

// PUT update an application by ID (protected route - requires authentication)
router.put('/:id',
     applicationController.upload.fields([
            { name: 'resume', maxCount: 1 },
            { name: 'coverLetter', maxCount: 1 },
            { name: 'transcript', maxCount: 1 },
        ]),
    authMiddleware,
    applicationController.updteApplicationValidationRules,
    applicationController.updateApplication
);

// DELETE an application by ID (protected route - requires authentication)
router.delete('/:id',
    authMiddleware, 
    applicationController.deleteApplication
);

module.exports = router;


// applicationController.upload.fields([
//         { name: 'resume', maxCount: 1 },
//         { name: 'coverLetter', maxCount: 1 },
//         { name: 'transcript', maxCount: 1 },
//     ])