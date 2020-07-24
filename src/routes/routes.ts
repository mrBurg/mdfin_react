import { TJSON } from '../interfaces';

export type TRouter = {
  href: URLS;
  title: string;
  alias?: string;
  button?: boolean;
};

export enum URLS {
  HOME = '/',
  CONTACTS = '/contacts',
  FAQ = '/faq',
  PAYMENT = '/payment',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
}

export enum URIS {
  COPYRIGHT = '/copyright',
  MAIN_PAGE = '/main-page',
  CONTACTS = '/contacts-page',
  PAYMENT = '/payment-page',
  FAQ_PAGE = '/faq-page',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  REGISTRATION_FORM = '/registration-form',
  PAYMENT_FORM = '/payment-form',
}

export enum APIS_URIS {
  SEND_OTP = '/signup/sendOtp',
  GET_OTP = '/test/getOtp',
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

export const allRoutes: Array<TRouter> = [];

for (let item in URLS) {
  allRoutes.push({
    href: (URLS as TJSON)[item],
    title: item,
  });
}
