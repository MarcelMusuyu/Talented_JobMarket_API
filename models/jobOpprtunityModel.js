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
         enum: ['Fixed-term Contract', 'Permanent Contract'],
        default: 'Permanent Contract'
    },
    education: {
        type: String,
        trim: true
    },
    salaryRange: {
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
        ref: 'Recruiter',
        required: true
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'Application'
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

const JobOpportunity = mongoose.model('JobOpportunity', jobOpportunitySchema);

module.exports = JobOpportunity;

