import { Request, Response, RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import {
    IPatientDocument,
    ErrorResponse,
    PathParams,
    ResponseData,
    CreatePatientRequest,
    UpdatePatientRequest
} from '../../types';
import Patient from '../../schema';

/**
 * Retrieves all patients from the database, sorted by creation date.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object containing an array of patients or an error response.
 */
export const getAllPatients = async (_: Request, res: Response<IPatientDocument[] | ErrorResponse>) => {
  try {
      const patients = await Patient.find().sort({ createdAt: -1 });
      res.json(patients);
  } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

/**
 * Retrieves a specific patient by ID.
 * @param {Request} req - Express request object with patient ID as a parameter.
 * @param {Response} res - Express response object containing the patient data or an error response.
 */
export const getPatientById: RequestHandler<PathParams, ResponseData> = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }
        res.json({ data: patient });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An error occurred' 
        });
    }
};

/**
 * Creates a new patient record in the database.
 * @param {Request} req - Express request object containing patient details in the body.
 * @param {Response} res - Express response object with the created patient data or an error response.
 */
export const createPatient: RequestHandler<{}, ResponseData, CreatePatientRequest> = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
        return;
    }

    try {
        const patient = new Patient(req.body);
        const newPatient = await patient.save();
        res.status(201).json({ 
            message: 'Patient created successfully',
            data: newPatient 
        });
    } catch (error) {
        res.status(400).json({ 
            message: error instanceof Error ? error.message : 'An error occurred' 
        });
    }
};

/**
 * Updates an existing patient record.
 * @param {Request} req - Express request object with patient ID as a parameter and updated data in the body.
 * @param {Response} res - Express response object with the updated patient data or an error response.
 */
export const updatePatient: RequestHandler<PathParams, ResponseData, UpdatePatientRequest> = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
        return;
    }

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404).json({ 
                message: 'Patient not found' 
            });
            return;
        }

        Object.assign(patient, req.body);
        const updatedPatient = await patient.save();
        res.json({ 
            message: 'Patient updated successfully',
            data: updatedPatient 
        });
    } catch (error) {
        res.status(400).json({ 
            message: error instanceof Error ? error.message : 'An error occurred' 
        });
    }
};

/**
 * Deletes a patient record from the database.
 * @param {Request} req - Express request object with patient ID as a parameter.
 * @param {Response} res - Express response object confirming deletion or an error response.
 */
export const deletePatient: RequestHandler<PathParams, ResponseData> = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404).json({ 
                message: 'Patient not found' 
            });
            return;
        }

        await Patient.deleteOne({ _id: req.params.id });
        res.json({ 
            message: 'Patient deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error instanceof Error ? error.message : 'An error occurred' 
        });
    }
};