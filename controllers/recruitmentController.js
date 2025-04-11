const JobOpportunity = require('../models/jobOpportunityModel');
const { body, validationResult } = require('express-validator');
const SelectionNotification = require('../models/selectionNotificationModel');
// Get all job opportunities
const getJobOpportunities = async (req, res) => {
    try {
        const jobOpportunities = await JobOpportunity.find().populate('recruiter', 'enterprise email');
        res.status(200).json(jobOpportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific job opportunity by ID
const getJobOpportunityById = async (req, res) => {
    try {
        const jobOpportunity = await JobOpportunity.findById(req.params.id).populate('recruiter', 'enterprise email');
        if (!jobOpportunity) {
            return res.status(404).json({ message: 'Job opportunity not found' });
        }
        res.status(200).json(jobOpportunity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get job opportunities by status
const getJobOpportunitiesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        if (!['open', 'closed', 'draft'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const jobOpportunities = await JobOpportunity.find({ status: status }).populate('recruiter', 'enterprise email');
        res.status(200).json(jobOpportunities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Validation rules for creating a job opportunity
const createJobOpportunityValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('requirements').isArray().withMessage('Requirements must be an array'),
    body('responsibilities').isArray().withMessage('Responsibilities must be an array'),
    body('location').notEmpty().withMessage('Location is required'),
    body('contract').notEmpty().isIn(['Full-time', 'Part-time', 'Internship', 'Temporary', 'Contract', 'Freelance', 'Remote']).withMessage('Invalid contract type'),
     body('salary').optional().isString().trim(),
    body('education').optional().isString().trim(),
    body('experience').optional().isString().trim(),
    body('closingDate').optional().isISO8601().toDate().withMessage('Invalid closing date format'),
    body('closingDate').optional().isISO8601().toDate().withMessage('Invalid closing date format'),
    body('recruiter').notEmpty().isMongoId().withMessage('Recruiter ID is required and must be a valid Mongo ID'),
    body('status').optional().isIn(['open', 'closed', 'draft']).withMessage('Invalid status value'),
];

// Create a new job opportunity
const createJobOpportunity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newJobOpportunity = new JobOpportunity(req.body);
        const savedJobOpportunity = await newJobOpportunity.save();
        res.status(201).json(savedJobOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Validation rules for updating a job opportunity
const updateJobOpportunityValidationRules = [
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('requirements').optional().isArray().withMessage('Requirements must be an array'),
    body('responsibilities').optional().isArray().withMessage('Responsibilities must be an array'),
    body('location').optional().notEmpty().withMessage('Location is required'),
    body('contract').optional().isIn(['Full-time', 'Part-time', 'Internship', 'Temporary', 'Contract', 'Freelance', 'Remote']).withMessage('Invalid contract type'),
     body('salary').optional().isString().trim(),
    body('education').optional().isString().trim(),
    body('experience').optional().isString().trim(),
    body('closingDate').optional().isISO8601().toDate().withMessage('Invalid closing date format'),
    body('closingDate').optional().isISO8601().toDate().withMessage('Invalid closing date format'),
    body('recruiter').optional().isMongoId().withMessage('Recruiter ID must be a valid Mongo ID'),
    body('status').optional().isIn(['open', 'closed', 'draft']).withMessage('Invalid status value'),
];

// Update an existing job opportunity
const updateJobOpportunity = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedJobOpportunity = await JobOpportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('recruiter', 'enterprise email');
        if (!updatedJobOpportunity) {
            return res.status(404).json({ message: 'Job opportunity not found' });
        }
        res.status(200).json(updatedJobOpportunity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job opportunity
const deleteJobOpportunity = async (req, res) => {
    try {
        const deletedJobOpportunity = await JobOpportunity.findByIdAndDelete(req.params.id);
        if (!deletedJobOpportunity) {
            return res.status(404).json({ message: 'Job opportunity not found' });
        }
        res.status(200).json({ message: 'Job opportunity deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- Functions related to Selection Notifications ---

// Get all selection notifications for a specific job opportunity
const getSelectionNotificationsByJobOpportunity = async (req, res) => {
    try {
        const { jobOpportunityId } = req.params;
        const notifications = await SelectionNotification.find({ jobOpportunity: jobOpportunityId })
            .populate('application', 'applicant jobOpportunity resume coverLetter transcript')
            .populate('recruiter', 'enterprise email')
            .populate('applicant', 'firstName lastName email');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Validation rules for creating a selection notification
const createSelectionNotificationValidationRules = [
    body('application').notEmpty().isMongoId().withMessage('Application ID is required and must be a valid Mongo ID'),
    body('status').notEmpty().isIn(['shortlisted', 'interviewScheduled', 'offerSent', 'rejected']).withMessage('Invalid status value'),
    body('details').optional().isString().trim(),
    body('recruiter').optional().isMongoId().withMessage('Recruiter ID must be a valid Mongo ID'),
    body('applicant').notEmpty().isMongoId().withMessage('Applicant ID is required and must be a valid Mongo ID'),
    body('jobOpportunity').notEmpty().isMongoId().withMessage('Job Opportunity ID is required and must be a valid Mongo ID'),
];

// Create a new selection notification for a job opportunity
const createSelectionNotification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newNotification = new SelectionNotification(req.body);
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.application) {
            return res.status(400).json({ message: 'A selection notification already exists for this application.' });
        }
        res.status(400).json({ message: err.message });
    }
};

// Validation rules for updating a selection notification
const updateSelectionNotificationValidationRules = [
    body('status').optional().isIn(['shortlisted', 'interviewScheduled', 'offerSent', 'rejected']).withMessage('Invalid status value'),
    body('details').optional().isString().trim(),
    body('recruiter').optional().isMongoId().withMessage('Recruiter ID must be a valid Mongo ID'),
];

// Update an existing selection notification for a job opportunity
const updateSelectionNotification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedNotification = await SelectionNotification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('application', 'applicant jobOpportunity resume coverLetter transcript')
         .populate('recruiter', 'enterprise email')
         .populate('applicant', 'firstName lastName email')
         .populate('jobOpportunity', 'title');
        if (!updatedNotification) {
            return res.status(404).json({ message: 'Selection notification not found' });
        }
        res.status(200).json(updatedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a selection notification for a job opportunity
const deleteSelectionNotification = async (req, res) => {
    try {
        const deletedNotification = await SelectionNotification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Selection notification not found' });
        }
        res.status(200).json({ message: 'Selection notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getJobOpportunities,
    getJobOpportunityById,
    getJobOpportunitiesByStatus,
    createJobOpportunity,
    updateJobOpportunity,
    deleteJobOpportunity,
    createJobOpportunityValidationRules,
    updateJobOpportunityValidationRules,
    getSelectionNotificationsByJobOpportunity,
    createSelectionNotification,
    updateSelectionNotification,
    deleteSelectionNotification,
    createSelectionNotificationValidationRules,
    updateSelectionNotificationValidationRules,
};

// --- Endpoints Needed for this Controller ---

/**
 * GET /job-opportunities
 * - Retrieves a list of all job opportunities, populating recruiter details.
 * - Response: JSON array of JobOpportunity objects.
 *
 * GET /job-opportunities/:id
 * - Retrieves a specific job opportunity by its ID, populating recruiter details.
 * - Response: JSON object of the JobOpportunity if found, 404 if not.
 *
 * GET /job-opportunities/status/:status
 * - Retrieves job opportunities filtered by their status ('open', 'closed', 'draft'), populating recruiter details.
 * - Response: JSON array of JobOpportunity objects matching the status.
 *
 * POST /job-opportunities
 * - Creates a new job opportunity.
 * - Requires 'title', 'description', 'requirements' (array), 'responsibilities' (array), 'location', 'contract', and 'recruiter' (Recruiter ID) in the request body.
 * - Optional: 'education', 'salaryRange', 'closingDate', 'status'.
 * - Response: JSON object of the newly created JobOpportunity.
 *
 * PUT /job-opportunities/:id
 * - Updates an existing job opportunity by its ID.
 * - Accepts optional fields to update in the request body: 'title', 'description', 'requirements', 'responsibilities', 'location', 'contract', 'education', 'salaryRange', 'closingDate', 'recruiter', 'status'.
 * - Response: JSON object of the updated JobOpportunity if found, 404 if not.
 *
 * DELETE /job-opportunities/:id
 * - Deletes a job opportunity by its ID.
 * - Response: JSON object with a success message if deleted, 404 if not.
 */