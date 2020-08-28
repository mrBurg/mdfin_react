export const ENVIRONMENT: string = process.env.ENVIRONMENT || '';
export const PO_API: string = process.env.PO_API || '';
export const PO_API_HOST: string = process.env.PO_API_HOST || '';
export const PO_API_PORT: string = process.env.PO_API_PORT || '';
export const ACCESS_TOKEN_KEY: string = process.env.ACCESS_TOKEN_KEY || '';
export const REFRESH_TOKEN_KEY: string = process.env.REFRESH_TOKEN_KEY || '';
export const SESSIONID_KEY: string = process.env.SESSIONID_KEY || '';
export const FINGER_PRINT: string = process.env.FINGER_PRINT || '';

export const eventPrefixes: Array<string> = ['webkit', 'moz', 'MS', 'o', ''];

export enum CONSTRUCTOR {
  ARRAY = 'Array',
  STRING = 'String',
}

export enum URIS_SUFFIX {
  SIGN_UP = '_SIGN_UP',
  SIGN_IN = '_SIGN_IN',
}

export enum METHOD {
  GET = 'get',
  POST = 'post',
}

export enum BUTTON_TYPE {
  BUTTON = 'button',
  SUBMIT = 'submit',
}

export enum INPUT_TYPE {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  TEL = 'tel',
  FILE = 'file',
  CHECKBOX = 'checkbox',
}

export enum ANIMATION {
  START = 'animationstart',
  END = 'animationend',
}

export enum TRANSITION {
  START = 'transitionstart',
  END = 'transitionend',
}

export enum HEADERS {
  AUTHORIZATION = 'Authorization',
  COOKIE = 'Cookie',
  SESSIONID = 'SESSIONID',
}

export enum RESPONSE_STATUS {
  OK = 'OK',
  ERROR = 'ERROR',
}

export enum FIELD_NAME {
  /* Obligatory */
  PHONE_NUMBER = 'phoneNumber',
  NAME = 'name',
  OTP = 'otp',
  BIRTH_DATE = 'birthDate',
  ID = 'cmnd_cccd',
  ISSUE_DATE = 'issueDate',
  EXPIRE_DATE = 'expireDate',
  GENDER_ID = 'gender_id',
  MARITAL_STATUS_ID = 'maritalStatus_id',
  NUMBER_OF_DEPENDENTS = 'numberOfDependents',
  EMAIL = 'email',
  LOAN_PURPOSE_ID = 'loanPurpose_id',
  PHONE_BRAND_ID = 'brand_id',
  PHONE_BRAND_OTHER = 'brandOther',
  PHONE_MODEL_ID = 'model_id',
  PHONE_MODEL_OTHER = 'modelOther',
  OTHER_PHONE_ID = 'otherPhone_id',
  OTHER_PHONE_NUMBER = 'otherPhoneNumber',
  AMOUNT = 'amount',

  /* Address */
  CITY_PROVINCE = 'cityProvince_id',
  DISTRICT = 'district_id',
  WARD_COMMUNE = 'wardCommune_id',
  STREET = 'street',
  BUILDING = 'building',
  APARTMENT = 'apartment',
  YEARS = 'currentPlaceLivingYear',
  MONTHS = 'currentPlaceLivingMonth',
  THIRD_PARTY_PHONE = 'phoneNumber',
  THIRD_PARTY_NAME = 'name',
  THIRD_PARTY_RELATION = 'type_id',

  /* Job */
  JOB_ID = 'job_id',
  SOCIAL_STATUS_ID = 'socialStatus_id',
  EDUCATION_ID = 'education_id',
  COMPANY_NAME = 'companyName',
  INDUSTRY_ID = 'industry_id',
  INDUSTRY_DETAILED_ID = 'industryDetailed_id',
  POS_TYPE_ID = 'posType_id',
  POS_NAME = 'posName',
  WORK_YEARS = 'jobLastPeriodYear',
  WORK_MONTHS = 'jobLastPeriodMonth',
  INCOME_ID = 'income_id',
  INCOME = 'income',

  /* Job contact */
  JOB_CONTACT_ID = 'id',
  JOB_CONTACT_PHONE = 'phoneNumber',
  JOB_CONTACT_NAME = 'name',
  JOB_CONTACT_TYPE_ID = 'type_id',

  ACCOUNT_ID = 'account_id',

  REASON_ID = 'reason_id',
}

export enum DOC_TYPE {
  ATTACHMENTS = 'attachments',
  ACCOUNTS = 'accounts',
  DOCS = 'docs',
  OTHER = 'other',
}
