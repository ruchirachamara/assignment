import mongoose, { Model } from 'mongoose';
import { IPatientDocument } from '../types';

const patientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    diagnosisStatus: {
        type: String,
        enum: ['Mild', 'Moderate', 'Severe'],
        required: true
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Patient: Model<IPatientDocument> = mongoose.model<IPatientDocument>('Patient', patientSchema);

export default Patient;