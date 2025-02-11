export interface Patient {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  diagnosisStatus: "Mild" | "Moderate" | "Severe";
  notes?: string;
}