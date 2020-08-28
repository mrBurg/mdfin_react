import _ from 'lodash';
import { TRouter } from './@types';

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
  SENDMONEY = '/sendmoney',
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

export enum URIS {
  //l10n
  CLEAR_CACHE = '/l10n/clear-cache',
  L10N_LIST = '/l10n/list',

  //signin
  SEND_OTP_SIGN_IN = '/signin/sendOtp',
  VALIDATE_OTP_SIGN_IN = '/signin/validateOtp',
  REFRESH_TOKEN = '/signin/refreshToken',
  SEND_OTP_SIGN_UP = '/signup/sendOtp',
  VALIDATE_OTP_SIGN_UP = '/signup/validateOtp',

  //test
  GET_OTP = '/test/getOtp',

  //calculator
  CALCULATE = '/calculator/calculate',

  //wizard
  GET_CLIENT_STEP = '/wizard/view',
  WIZARD_START = '/wizard/start',
  obligatory = '/wizard/obligatory',
  address = '/wizard/address',
  job = '/wizard/job',

  //directory
  DIRECTORY = '/directory/',

  //cabinet
  application = '/cabinet/application',
}

/* путь к сервису справочника */
export enum DIRECTORIES {
  /* Obligatory */
  dirGender = 'gender',
  dirMaritalStatus = 'marital_status',
  dirLoanPurpose = 'loan_purpose',
  dirMobilePhoneBrand = 'mobile_phone_brand',
  dirMobilePhoneModel = 'mobile_phone_brand',

  /* Address */
  dirCityProvince = 'city_province',
  dirDistrict = 'district',
  dirWardCommune = 'ward_commune',
  dirThirdPartyRelation = 'third_party_relation',

  /* Job */
  dirSocialStatus = 'social_status',
  dirEducation = 'education',
  dirIndustry = 'industry',
  dirIndustryDetailed = 'industry',
  dirJobPosType = 'job_pos_type',
  dirJobRelationType = 'job_relation_type',
  dirBank = 'bank',
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
