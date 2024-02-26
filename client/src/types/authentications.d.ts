export interface IAuthValidationForm {
  id?: string;
  phoneNumber: string;
  email: string;
  fullName: string;
  password: string;
  confirmPassword?: string;
  birthDay: string;
}
