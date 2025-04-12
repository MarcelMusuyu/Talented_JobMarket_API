/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
     enterprise: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        trim: true,
          enum: ['startup', 'small corporation', 'large corporation'],
        default: 'startup'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    profile: {
        type: String,
        trim: true
    },
    password: {
        type: String,
	required: true,
    },
    assignedJobs: [{
        type: Schema.Types.ObjectId,
        ref: 'jobopportunities'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Recruiter = mongoose.model('recruiters', recruiterSchema);
module.exports =Recruiter;
