import { IDepartment } from './common';

export interface IUserProfile {
  id: string;
  phoneNumber: string;
  gender: Gender | null;
  fullName: string;
  role: RoleApp;
  email: string;
  avatar: string;
  citizenIdentification: string;
  birthDay: string;
}

export interface IAddress {
  id?: string;
  street: string | undefined;
  village: string | undefined;
  district: string | undefined;
  city: string | undefined;
  date?: string;
}

interface IPatient {
  id?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  id: string;
  street: string;
  village: string;
  district: string;
  city: string;
  date?: string;
}

export interface IPatient {
  id?: string;
  phoneNumber: string;
  email: string;
  password: string;
  fullName: string;
  birthDay: string;
  citizenIdentification?: string;
  isActive?: boolean;
  currentAddress?: string;
}

export interface IPatientRes {
  patientId: string;
  baseUser: IPatient;
}

export interface IUser {
  id?: string;
  phoneNumber?: string;
  email?: string;
  fullName: string;
  birthDay: string;
  citizenIdentification?: string;
  isActive?: boolean;
  currentAddress?: IAddress;
}

export interface IDoctor {
  doctorId: string;
  degree: string;
  baseUser: IUser;
  notarizedImages?: FileList | Blob | undefined | string[];
  avatar?: string;
  departments: Pick<IDepartment, 'deId' | 'name'>[];
  currentJob?: string;
  nameImages?: INameImages | undefined;
  diagnosticFee: number;
}

export interface IListDoctor {
  data: IDoctor[];
  flag: boolean;
  status: number;
}
