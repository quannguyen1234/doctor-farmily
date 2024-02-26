import { useMutation, useQuery } from '@tanstack/react-query';

import http from '@/configs/api/axios.config';
import { IMedicalRecord } from '../types/doctor';

interface IAddMedicalRecord extends IMedicalRecord {
  flag: boolean;
  status: number;
}

const addMedicalRecord = async (payload: any) => {
  const res = await http.post(
    'medical-record-mangament/medical-records',
    payload
  );
  return res as unknown as IAddMedicalRecord;
};

export const useAddMedicalRecord = () => {
  return useMutation({
    mutationFn: (payload: any) => addMedicalRecord(payload)
  });
};

interface IGetMedicalRecordOfDoctor {
  patientName: string;
  age: number;
  patientId: string;
  gender: null | boolean;
  date: string;
}

const getMedicalRecordOfDoctor = async (id: string) => {
  const res = await http.get<IGetMedicalRecordOfDoctor[]>(
    `medical-record-mangament/medical-records/doctor/${id}`
  );
  return res.data as unknown as IGetMedicalRecordOfDoctor[];
};

export const useGetMedicalRecordOfDoctor = (id: string) => {
  return useQuery({
    queryKey: ['get-medical-record-doctor', id],
    queryFn: () => getMedicalRecordOfDoctor(id)
  });
};

interface IPrescriptions {
  prescriptionId: number;
  medicineName: string;
  note: string;
}

export interface IRecord {
  name: string;
  recordId: string;
  symptom: string;
  diagnosis: string;
  treatmentPlan: string;
  condition: string;
  date: string;
  prescriptions: IPrescriptions[];
  patientId: string;
  doctorId: string;
  doctorName: string;
  currentJob: string;
  departments: string[];
}

export interface IPatient {
  patientId: string;
  baseUser: {
    phoneNumber: number;
    email: string;
    fullName: string;
    citizenIdentification: null | string | number;
  };
}

interface IGetMedicalRecordById {
  patient: IPatient;
  records: IRecord[];
}

const getMedicalRecordById = async (id: string) => {
  const res = await http.get<IGetMedicalRecordById>(
    `medical-record-mangament/medical-records/patient/${id}`
  );
  return res.data as unknown as IGetMedicalRecordById;
};

export const useGetMedicalRecordById = (id: string) => {
  return useQuery({
    queryKey: ['get-medical-record-patient-id', id],
    queryFn: () => getMedicalRecordById(id)
  });
};
