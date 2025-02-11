import { Document } from 'mongoose';

export type DiagnosisStatus = 'Mild' | 'Moderate' | 'Severe';

interface IContact {
  email: string;
  phone: string;
}

export interface IPatient {
  fullName: string;
  dateOfBirth: Date;
  contact: IContact;
  diagnosisStatus: DiagnosisStatus;
  notes?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: any[];
}

export interface PathParams {
  id: string;
}

export interface CreatePatientRequest {
  fullName: string;
  dateOfBirth: Date;
  contact: {
      email: string;
      phone: string;
  };
  diagnosisStatus: DiagnosisStatus;
  notes?: string;
}

export interface IPatientDocument extends Document {
  fullName: string;
  dateOfBirth: Date;
  contact: {
      email: string;
      phone: string;
  };
  diagnosisStatus: DiagnosisStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResponseData {
  message?: string;
  data?: IPatientDocument;
  errors?: any[];
}

export interface UpdatePatientRequest {
  fullName?: string;
  dateOfBirth?: Date;
  contact?: {
      email?: string;
      phone?: string;
  };
  diagnosisStatus?: DiagnosisStatus;
  notes?: string;
}