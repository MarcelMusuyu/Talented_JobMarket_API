const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const selectionNotificationSchema = new Schema({
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
        unique: true // One notification per application
    },
    status: {
        type: String,
        enum: ['shortlisted', 'interviewScheduled', 'offerSent', 'rejected'],
        required: true
    },
    notificationDate: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String,
        trim: true
    },
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    },
    jobOpportunity: {
        type: Schema.Types.ObjectId,
        ref: 'JobOpportunity'
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

const SelectionNotification = mongoose.model('SelectionNotifications', selectionNotificationSchema);

module.exports = SelectionNotification;