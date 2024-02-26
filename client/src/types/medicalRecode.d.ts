export interface IMedicalRecord {
  PatientId: string;
  symptom: string;
  diagnosis: string;
  treatmentPlan: string;
  condition: string;
  prescriptions: IPrescription[];
}

export interface IPrescription {
  medicineName: string;
  note: string;
}
