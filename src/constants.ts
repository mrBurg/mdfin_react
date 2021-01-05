import { TJSON } from '@interfaces';
import moment from 'moment';

export const ENVIRONMENT = process.env.ENVIRONMENT || '';
export const PO_PROJECT_HOST = process.env.PO_PROJECT_HOST || '';
export const PO_API = process.env.PO_API || '';
export const PO_API_HOST = process.env.PO_API_HOST || '';
export const PO_API_PORT = process.env.PO_API_PORT || '';
export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || '';
export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY || '';
export const SESSION_ID_KEY = process.env.SESSION_ID_KEY || '';
export const EXTERNAL_SESSION_KEY = process.env.EXTERNAL_SESSION_KEY || '';
export const FINGER_PRINT_KEY = process.env.FINGER_PRINT_KEY || '';
export const LOCALE_KEY = process.env.LOCALE_KEY || '';

export const EVENT_PREFIXES = ['webkit', 'moz', 'MS', 'o', ''];

export enum EEvents {
  //Router Events
  CHANGE_COMPLETE = 'routeChangeComplete',
}

export enum CONSTRUCTOR {
  ARRAY = 'Array',
  STRING = 'String',
}

export enum URIS_SUFFIX {
  SIGN_UP = '_SIGN_UP',
  SIGN_IN = '_SIGN_IN',
  APPLICATION = 'APPLICATION',
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
  CONTENT_TYPE = 'Content-Type',
  REFERER = 'Referer',
}

export enum RESPONSE_STATUS {
  OK = 'OK',
  ERROR = 'ERROR',
}

export enum OTP_ACTION {
  LOGIN = 'LOGIN',
  VERIFY_PHONE = 'VERIFY_PHONE',
  SIGN = 'SIGN',
}

export enum FIELD_NAME {
  OTP_AGREE_CHECKBOX = 'otpAgreeCheckbox',

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
  PAYMENT_AMOUNT = 'paymentAmount', //поле на странице deal

  /* Address */
  CITY_PROVINCE = 'cityProvince_id',
  DISTRICT = 'district_id',
  WARD_COMMUNE = 'wardCommune_id',
  STREET = 'street',
  BUILDING = 'building',
  APARTMENT = 'apartment',
  YEARS = 'currentPlaceLivingYear',
  MONTHS = 'currentPlaceLivingMonth',
  THIRD_PARTY_PHONE = 'thirdParty_phoneNumber',
  THIRD_PARTY_NAME = 'thirdParty_name',
  THIRD_PARTY_RELATION = 'thirdParty_type_id',

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
  JOB_CONTACT_PHONE = 'jobContact_phoneNumber',
  JOB_CONTACT_NAME = 'jobContact_name',
  JOB_CONTACT_TYPE_ID = 'type_id',

  ACCOUNT_ID = 'account_id',
  BANK_ID = 'bank_id',
  REASON_ID = 'reason_id',
  ACCOUNT_NUMBER = 'accountNumber',
}

export const GRAPHIC_FILES = ['.gif', '.jpg', '.jpeg', '.png', '.bmp', '.tiff'];

export enum STATUS {
  NOT_AUTHORIZED = 401,
  BAD_REQUEST = 400,
}

export enum DOC_TYPE {
  idFront = 4,
  idBack = 5,
  selfie = 6,
  other = 13,
}

export const dynamicTagslist: TJSON = {
  year: `${moment().format('YYYY')}`,
};

export enum CALLBACK_TYPE {
  phones = 'tel',
  emails = 'mailto',
  calls = 'callto',
}

export enum LINK_TARGET {
  BLANK = '_blank',
}

export enum COMPONENT_TYPE {
  STRING = 'string',
  FUNCTION = 'function',
  OBJECT = 'object',
}

export enum COOKIE {
  SESSIONID = 'SESSIONID',
}
