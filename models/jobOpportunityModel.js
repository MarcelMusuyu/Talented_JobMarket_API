const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobOpportunitySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
     responsibilities: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        required: true,
        trim: true
    },
     contract: {
        type: String,
        required: true,
         enum: ['Full-time', 'Part-time', 'Internship', 'Temporary', 'Contract', 'Freelance', 'Remote'],
        default: 'Full-time'
    },
    salary: {
        type: String,
        trim: true
    },
    education: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    closingDate: {
        type: Date
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'recruiters',
        required: true
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'applications'
    }],
    status: {
        type: String,
        enum: ['open', 'closed', 'draft'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const JobOpportunity = mongoose.model('jobopportunities', jobOpportunitySchema);

module.exports = JobOpportunity;

