import _ from 'lodash';
import { TRouter } from './@types';

//ссылки на страницы сайта
export enum BASE_URLS {
  HOME = '/',
  index = '/index',
  CONTACTS = '/contacts',
  FAQ = '/faq',
  REPAYMENT = '/repayment',
  SIGN_IN = '/sign-in',
  phoneverify = '/sign-up',
  deal = '/deal',
  application = '/application',
  inprocess = '/inprocess',
  notify = '/notify',
  sendmoney = '/sendmoney',
  wrongaccount = '/wrongaccount',
  NOT_FOUND = '/404',
}

export enum CLIENT_URLS {
  obligatory = '/client/obligatory',
  address = '/client/address',
  job = '/client/job',
  attachment_account = '/client/documents',
}

export const URLS = {
  ...BASE_URLS,
  ...CLIENT_URLS,
};

//ссылки для вызова сервисов
export enum URIS {
  // l10n
  CLEAR_CACHE = '/l10n/clear-cache',
  L10N_LIST = '/l10n/list',

  // signin
  SEND_OTP_SIGN_IN = '/signin/sendOtp',
  VALIDATE_OTP_SIGN_IN = '/signin/validateOtp',
  REFRESH_TOKEN = '/signin/refreshToken',
  SEND_OTP_SIGN_UP = '/signup/sendOtp',
  VALIDATE_OTP_SIGN_UP = '/signup/validateOtp',
  LOGOUT = '/signin/logout',

  // test
  GET_OTP = '/test/getOtp',

  // calculator
  GET_PRODUCTS = '/calculator/getProducts',
  CALCULATE = '/calculator/calculate',

  // wizard
  GET_CLIENT_STEP = '/wizard/view',
  WIZARD_START = '/wizard/start',
  obligatory = '/wizard/obligatory',
  address = '/wizard/address',
  job = '/wizard/job',
  account = '/wizard/account',

  //directory
  DIRECTORY = '/directory/',

  // cabinet & application
  application = '/cabinet/application',
  CABINET_SIGN = '/cabinet/sign',
  CABINET_CONFIRM = '/cabinet/confirm',
  CABINET_DECLINE = '/cabinet/decline',
  deals = '/cabinet/deals', //Запрос данных для отображения сделки в ЛК
  deal = '/cabinet/deal', //Запрос данных для отображения сделки на сайте
  CABINET_PAY = '/cabinet/pay', //погашение из сайта И ЛК

  CABINET_CHANGE_ACCOUNT = '/cabinet/changeAccount', //смена счета на странице wrongaccount

  // notification
  notify = '/notification',
  notify_Confirm_Display = '/notification/confirmDisplay',

  // attachment
  UPLOAD_ATTACHMENT = '/attachment/upload',
}

/* путь к сервису справочника */
export enum DIRECTORIES {
  // Obligatory
  dirGender = 'gender',
  dirMaritalStatus = 'marital_status',
  dirLoanPurpose = 'loan_purpose',
  dirMobilePhoneBrand = 'mobile_phone_brand',
  dirMobilePhoneModel = 'mobile_phone_brand',

  // Address
  dirCityProvince = 'city_province',
  dirDistrict = 'district',
  dirWardCommune = 'ward_commune',
  dirThirdPartyRelation = 'third_party_relation',

  // Job
  dirSocialStatus = 'social_status',
  dirEducation = 'education',
  dirIndustry = 'industry',
  dirIndustryDetailed = 'industry',
  dirJobPosType = 'job_pos_type',
  dirJobRelationType = 'job_relation_type',

  // Accounts
  dirBank = 'bank',

  // Application
  dirDeclinedByClientReason = 'declined_by_client_reason',
}

export const mainMenu: Array<TRouter> = [
  {
    href: URLS.CONTACTS,
    title: 'Contacts',
  },
  {
    href: URLS.FAQ,
    title: 'FAQ',
  },
  {
    href: URLS.REPAYMENT,
    title: 'Repayment',
  },
  {
    href: URLS.SIGN_IN,
    title: 'Sign In',
    button: true,
  },
];

export const allRoutes: Array<TRouter> = _.map(URLS, (val, key) => {
  return {
    href: val,
    title: key,
  };
});
