export const ENVIRONMENT: string = process.env.ENVIRONMENT || '';
export const PO_API: string = process.env.PO_API || '';
export const PO_API_HOST: string = process.env.PO_API_HOST || '';
export const PO_API_PORT: string = process.env.PO_API_PORT || '';
export const ACCESS_TOKEN_KEY: string = process.env.ACCESS_TOKEN_KEY || '';
export const REFRESH_TOKEN_KEY: string = process.env.REFRESH_TOKEN_KEY || '';
export const SESSIONID_KEY: string = process.env.SESSIONID_KEY || '';
export const FINGER_PRINT: string = process.env.FINGER_PRINT || '';

export const eventPrefixes: Array<string> = ['webkit', 'moz', 'MS', 'o', ''];

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
  PHONE_NUMBER = 'phoneNumber',
  NAME = 'name',
  OTP = 'otp',
  BIRTH_DATE = 'birthDate',
}
