import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { body, validationResult } from 'express-validator';

import { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient } from './api/patient';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB with error handling
mongoose
    .connect('mongodb://localhost:27017/ADHD')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Validation rules
const validatePatient = [
    body('fullName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Full name must be at least 2 characters long'),

    // body('dob')
    //     .isISO8601()
    //     .withMessage('Date of birth must be a valid ISO8601 date'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+?[\d\s-]+$/)
        .withMessage('Invalid phone number format'),

    body('diagnosisStatus')
        .isIn(['Mild', 'Moderate', 'Severe'])
        .withMessage('Diagnosis status must be Mild, Moderate, or Severe'),
];

// Middleware to handle validation errors
const handleValidationErrors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        return;
    }
    next();
};

// All endpoints
app.get('/api/patients', getAllPatients);
app.get('/api/patients/:id', getPatientById);
app.post('/api/patients', validatePatient, handleValidationErrors, createPatient);
app.put<{ id: string }>('/api/patients/:id', validatePatient, handleValidationErrors, updatePatient);
app.delete('/api/patients/:id', deletePatient);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
