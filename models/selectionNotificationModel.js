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
        ref: 'recruiters'
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'applicants'
    },
    jobOpportunity: {
        type: Schema.Types.ObjectId,
        ref: 'jobopportunities'
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

const SelectionNotification = mongoose.model('selectionnotifications', selectionNotificationSchema);

module.exports = SelectionNotification;