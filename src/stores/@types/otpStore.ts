import { TLinks } from '../../components/hocs/WithLink/@types';

export type TOtpProps = {
  action?: string;
  otpId?: number; //тут бы этот параметр обязательным сделать...
  phoneNumber?: string;
};

export type TOtpFormStatic = {
  termsAndConditions: string;
  wrongOtp: string;
  sendOtp: string;
  links: TLinks;
};
