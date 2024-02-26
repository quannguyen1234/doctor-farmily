import Gender from '@/enums/gender';
import { IAuthValidationForm } from '@/types/authentications';
import { IAddress, IUserProfile } from '@/types/user';
import { IDepartment } from '@/types/common';

export interface IUserResponse {
  refresh: string;
  access: string;
  // user: {
  //   id: string;
  //   phoneNumber: string;
  //   gender: Gender | null;
  //   fullName: string;
  //   role: RoleApp;
  //   email: string;
  // };
  user: IUserProfile;
  flag: boolean;
}

export interface IUserAuthen {
  baseUser: {
    phoneNumber: string;
    email: string;
    fullName: string;
    password: string;
  };
  flag: boolean;
}

export interface IDoctorAuthen {
  baseUser: {
    phoneNumber: string;
    email: string;
    fullName: string;
    password: string;
    birthDay: string;
    citizenIdentification: string;
  };
  degree: string | string[];
  currentJob: string | string[];
  expreience: string;
  notarizedImage: string[];
  currentAddress: Omit<IAddress, 'id'>;
  nameImages: INameImages;
  flag: boolean;
}

export interface IRegisterFormDocter extends IAuthValidationForm, INameImages {
  degree: string | string[];
  currentJob: string | string[];
  expreience: string;
  departments: Pick<IDepartment, 'deId' | 'name'>[];
  confirmPassword: string;
  city: string;
  district: string;
  street: string;
  village: string;
  gender: Gender | 'other';
  citizenIdentification: string;
  notarizedImages: FileList | Blob | undefined | string[];
  nameImages: INameImages | undefined;
  diagnosticFee: float;
}
