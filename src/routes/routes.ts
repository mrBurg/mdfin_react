import _ from 'lodash';

export type TRouter = {
  href: URLS;
  title: string;
  alias?: string;
  button?: boolean;
  subSteps?: any;
};

export enum URLS {
  HOME = '/',
  index = '/index',
  CONTACTS = '/contacts',
  FAQ = '/faq',
  PAYMENT = '/payment',
  SIGN_IN = '/sign-in',
  phoneverify = '/sign-up',
  obligatory = '/client',
  deal = '/deal',
  application = '/application',
  NOT_FOUND = '/404',
}

export enum URIS {
  CLEAR_CACHE = '/l10n/clear-cache',
  L10N_LIST = '/l10n/list',
  SEND_OTP_SIGN_UP = '/signup/sendOtp',
  SEND_OTP_SIGN_IN = '/signin/sendOtp',
  VALIDATE_OTP_SIGN_UP = '/signup/validateOtp',
  VALIDATE_OTP_SIGN_IN = '/signin/validateOtp',
  GET_OTP = '/test/getOtp',
  CALCULATE = '/calculator/calculate',
  GET_CLIENT_STEP = '/wizard/view',
  WIZARD_START = '/wizard/start',
  OBLIGATORY = '/wizard/obligatory',
  DIRECTORY = '/directory/',
}

export enum CLIENT_STEP {
  obligatory = 'aboutMyself',
  address = 'addresses',
  job = 'work',
  attachment_account = 'documents',
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
    href: URLS.PAYMENT,
    title: 'Payment',
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
    subSteps: key == 'obligatory' ? CLIENT_STEP : null,
  };
});
