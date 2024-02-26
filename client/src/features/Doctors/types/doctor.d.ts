export interface IMedicalRecord {
  patientId: string;
  symptom: string;
  condition: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: {
    medicineName: string;
    note: string;
  };
}
