const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const auth = require('../middleware/auth'); 
// --- Job Opportunity Routes ---

// GET all job opportunities
router.get('/',auth, recruitmentController.getJobOpportunities);

// GET job opportunity by ID
router.get('/:id',auth, recruitmentController.getJobOpportunityById);

// GET job opportunities by status
router.get('/status/:status',auth, recruitmentController.getJobOpportunitiesByStatus);

// POST a new job opportunity
router.post('/',auth,
    recruitmentController.createJobOpportunityValidationRules,
    recruitmentController.createJobOpportunity
);

// PUT update a job opportunity by ID
router.put('/:id',auth,
    recruitmentController.updateJobOpportunityValidationRules,
    recruitmentController.updateJobOpportunity
);

// DELETE a job opportunity by ID
router.delete('/:id',auth, recruitmentController.deleteJobOpportunity);

// --- Selection Notification Routes (nested under job opportunities for creation/retrieval) ---

// GET all selection notifications for a specific job opportunity
router.get('/:jobOpportunityId/notifications',auth,
    recruitmentController.getSelectionNotificationsByJobOpportunity
);

// POST a new selection notification for a specific job opportunity
router.post('/:jobOpportunityId/notifications',auth,
    recruitmentController.createSelectionNotificationValidationRules,
    recruitmentController.createSelectionNotification
);

// --- Selection Notification Routes (for update and delete by notification ID) ---

// PUT update a selection notification by ID
router.put('/notifications/:id',auth,
    recruitmentController.updateSelectionNotificationValidationRules,
    recruitmentController.updateSelectionNotification
);

// DELETE a selection notification by ID
router.delete('/notifications/:id',auth, recruitmentController.deleteSelectionNotification);

module.exports = router;