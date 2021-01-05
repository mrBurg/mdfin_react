export type TField = {
  name: string;
  value: any; //string | Date;
};

export type TUserObligatory = {
  phoneNumber?: string;

  /* Obligatory */
  pi_id?: number;
  name?: string;
  birthDate?: Date; //2020-08-13T15:37:25.787Z,
  cmnd_cccd?: string;
  issueDate?: Date; //2020-08-13T15:37:25.787Z,
  expireDate?: Date; //2020-08-13T15:37:25.787Z,
  gender_id?: string;
  maritalStatus_id?: number;
  numberOfDependents?: number;
  email_id?: number;
  email?: string;
  loanPurpose_id?: number;
  mobilePhone_id?: number;
  brand_id?: number;
  brandOther?: string;
  model_id?: number;
  modelOther?: string;
  otherPhone_id?: number;
  otherPhoneNumber?: string;

  shouldShow_PHONE_BRAND_OTHER?: string;
  shouldShow_PHONE_MODEL_OTHER?: string;
};

export type TUserAddress = {
  /* Address */
  id?: number;
  cityProvince_id?: number;
  district_id?: number;
  wardCommune_id?: number;
  street?: string;
  building?: string;
  apartment?: string;
  livingPeriod?: string;
  currentPlaceLivingYear?: number;
  currentPlaceLivingMonth?: number;
  thirdPartyPhone?: string;
  thirdPartyName?: string;
  thirdPartyRelation?: string;

  shouldShow_DISTRICT?: boolean;
  shouldShow_WARD_COMMUNE?: boolean;
};

export type TUserContacts = {
  id?: number;
  name?: string;
  phoneNumber?: string;
  type_id?: string;
};

export type TUserJobContact = {
  id?: number;
  name?: string;
  phoneNumber?: string;
  type_id?: number;
};
export type TUserJob = {
  job_id?: number;
  socialStatus_id?: number;
  education_id?: number;
  companyName?: string;
  industry_id?: number;
  industryDetailed_id?: number;
  posType_id?: number;
  posName?: string;
  jobLastPeriodYear?: number;
  jobLastPeriodMonth?: number;
  contact?: TUserJobContact;
  income_id?: number;
  income?: number;
};

export type TUserData = {
  otpId?: number;
} & TUserObligatory /* &
  TUserAddress &
  TUserContacts &
  TUserJob */ /* &
  TUserJobContact */;

export type TGetClientStep = {
  view: string;
};
