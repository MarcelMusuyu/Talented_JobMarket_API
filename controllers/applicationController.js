/* eslint-disable no-undef */

const Applicant = require('../models/applicantModel');
const Application = require('../models/applicationModel');
// eslint-disable-next-line no-unused-vars
const express = require('express');

const utilities = require('../utilities');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// GitHub repository URL for file access
const githubRepository = "https://github.com/MarcelMusuyu/Talented_JobMarket_API/blob/main/uploads/";

// Configure Multer for local file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads'; // All uploaded files will go to the 'uploads' folder
        cb(null, path.join(__dirname, folder));
    },
    filename: function (req, file, cb) {
        const { applicant, jobOpportunity } = req.body; // Assuming these IDs are available
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const filename = `${applicant}_${jobOpportunity}_${file.fieldname}_${uniqueSuffix}${fileExtension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

const getApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate('jobOpportunity','title')
        .populate('applicant', 'firstName lastName email profile');
        ;
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
        const application = await Application.findById(req.params.id).populate('JobOpportunity')
          .populate('applicant', 'firstName lastName email profile');
        ;
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.setHeader('Content-Type', 'application/json');
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addApplicationValidationRules = [
    body('applicant').notEmpty().withMessage('Applicant ID is required'),
    body('jobOpportunity').notEmpty().withMessage('Job Opportunity ID is required'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
        body('email').notEmpty().withMessage('Email is required'),
    body('skills').optional().isArray().trim(),
    body('languages').optional().isArray().trim(),
];

const addApplication = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
        { name: 'transcript', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { jobOpportunity,email, skills, languages } = req.body;
            let resumeUrl = null;
            let coverLetterUrl = null;
            let transcriptUrl = null;
            let applicant=null;
             const user = await Applicant.findOne({ email });
            if (!user) {
                 applicant= user.Id;
            }

            if (req.files?.resume && req.files.resume[0]) {
                resumeUrl = path.join(githubRepository, req.files.resume[0].filename);
            } else {
                return res.status(400).json({ message: 'Resume file is required.' });
            }

            if (req.files?.coverLetter && req.files.coverLetter[0]) {
                coverLetterUrl = path.join(githubRepository, req.files.coverLetter[0].filename);
            }

            if (req.files?.transcript && req.files.transcript[0]) {
                transcriptUrl = path.join(githubRepository, req.files.transcript[0].filename);
            }

            const application = new Application({
                applicant: applicant,
                jobOpportunity: jobOpportunity,
                resume: resumeUrl,
                coverLetter: coverLetterUrl,
                skills: skills,
                languages: languages,
                transcript: transcriptUrl,
            });

            const newApplication = await application.save();

            if (!newApplication) return res.status(400).json({ message: 'Application not created' });

            res.status(201).json(newApplication);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

const updteApplicationValidationRules = [
    body('applicant').optional().notEmpty().withMessage('Applicant ID is required'),
    body('jobOpportunity').optional().notEmpty().withMessage('Job Opportunity ID is required'),
    body('email').optional().isEmail().withMessage('Email must be a valid email address'),
    body('email').optional().notEmpty().withMessage('Email is required'),
    body('skills').optional().isString().trim(),
    body('languages').optional().isString().trim(),
    body('status').optional().isIn(['pending', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'rejected']).withMessage('Invalid status value'),
    body('selection').optional().isString().trim(), // Assuming SelectionNotification ID
];

const updateApplication = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
        { name: 'transcript', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const applicationId = req.params.id;
            const updateData = {};

            if (req.body.applicant) updateData.applicant = req.body.applicant;
            if (req.body.jobOpportunity) updateData.jobOpportunity = req.body.jobOpportunity;
            if (req.body.skills) updateData.skills = req.body.skills;
            if (req.body.languages) updateData.languages = req.body.languages;
            if (req.body.status) updateData.status = req.body.status;
            if (req.body.selection) updateData.selection = req.body.selection;

            if (req.files?.resume && req.files.resume[0]) {
                updateData.resume = path.join(githubRepository, req.files.resume[0].filename);
            }
            if (req.files?.coverLetter && req.files.coverLetter[0]) {
                updateData.coverLetter = path.join(githubRepository, req.files.coverLetter[0].filename);
            }
            if (req.files?.transcript && req.files.transcript[0]) {
                updateData.transcript = path.join(githubRepository, req.files.transcript[0].filename);
            }

            const updatedApplication = await Application.findByIdAndUpdate(applicationId, updateData, { new: true });
            if (!updatedApplication) return res.status(404).json({ message: 'Application not found' });
            res.json(updatedApplication);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

const deleteApplication = async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);
        if (!deletedApplication) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getApplications,
    getCandidates,
    getApplicationById,
    addApplication,
    updateApplication,
    deleteApplication,
    addApplicationValidationRules,
    updteApplicationValidationRules,
    upload,
};

// --- Endpoints Needed for this Controller ---

/**
 * GET /applications
 * - Retrieves a list of all applications, populating applicant and jobOpportunity details.
 * - Response: JSON array of Application objects.
 *
 * GET /candidates
 * - Retrieves a list of all applicants.
 * - Response: JSON array of Applicant objects.
 *
 * GET /applications/:id
 * - Retrieves a specific application by its ID, populating applicant and jobOpportunity details.
 * - Response: JSON object of the Application if found, 404 if not.
 *
 * POST /applications
 * - Creates a new application, including uploading resume, cover letter, and transcript.
 * - Requires 'applicant' (Applicant ID), 'jobOpportunity' (JobOpportunity ID) in the request body.
 * - Accepts 'resume', 'coverLetter', and 'transcript' as file uploads in the 'multipart/form-data' format.
 * - Optional: 'skills', 'languages' in the request body.
 * - Response: JSON object of the newly created Application.
 *
 * PUT /applications/:id
 * - Updates an existing application by its ID, including optionally updating resume, cover letter, and transcript.
 * - Accepts 'resume', 'coverLetter', and 'transcript' as file uploads in the 'multipart/form-data' format.
 * - Optional fields to update in the request body: 'applicant', 'jobOpportunity', 'skills', 'languages', 'status', 'selection'.
 * - Response: JSON object of the updated Application if found, 404 if not.
 *
 * DELETE /applications/:id
 * - Deletes an application by its ID.
 * - Response: JSON object with a success message if deleted, 404 if not.
 */