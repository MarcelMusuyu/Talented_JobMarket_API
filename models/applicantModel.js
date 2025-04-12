
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
      firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
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
        required: true
    },
    applications: [{
        type: Schema.Types.ObjectId,
        ref: 'applications'
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

const Applicant = mongoose.model('applicants', applicantSchema);

module.exports = Applicant;