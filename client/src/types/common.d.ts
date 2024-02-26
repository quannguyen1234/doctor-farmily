export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string[] | string;
}

export interface LayoutProps {
  children: JSX.Element;
}

export interface IInput {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  label?: string;
  type: string;
  id: string;
  placeholder?: string;
}

export interface IBaseResponse {
  message: string;
  flag: boolean;
  status: number;
}

export interface IDepartment {
  deId: string;
  name: string;
  images: FileList | Blob | undefined | string[];
  imageNames?: string[];
}

export interface IDepartmentRes {
  data: IDepartment;
  flag: boolean;
}

export interface INameImages {
  avatar: string;
  notarizedImages: string[];
}

export interface ISearchDocterParams {
  deId: string;
  department: string;
  address: {
    district: string;
    city: string;
  };
}

export type BookingStatus = 'idle' | 'booked' | 'waiting';

export interface IDuration {
  lat: number;
  lng: number;
}
