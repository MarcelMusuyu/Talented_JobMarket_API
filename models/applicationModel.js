const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'applicants',
        required: true
    },
    jobOpportunity: {
        type: Schema.Types.ObjectId,
        ref: 'jobopportunities',
        required: true
    },
    resume: {
        type: String, 
        required: true
    },
    coverLetter: {
        type: String 
    },
     skills: [{
        type: String,
        trim: true
    }],
     languages: [{
        type: String,
        trim: true
    }],
    transcript : {
        type: String // URLs or paths to other relevant documents
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'interviewing', 'offered', 'rejected'],
        default: 'pending'
    },

    selection: {
        type: Schema.Types.ObjectId,
        ref: 'selectionnotifications'
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

// Ensure that an applicant can only apply once to the same job
applicationSchema.index({ applicant: 1, jobOpportunity: 1 }, { unique: true });

const Application = mongoose.model('applications', applicationSchema);

module.exports = Application;
