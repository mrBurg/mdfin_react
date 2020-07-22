export type TRouter = {
  href: URLS;
  alias: string;
  title: string;
  button?: boolean;
  hidden?: boolean;
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
  FAQ_PAGE = '/faq-page',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  LOAN = '/loan',
}

export const mainMenu: Array<TRouter> = [
  {
    href: URLS.CONTACTS,
    alias: 'contacts',
    title: 'Contacts',
  },
  {
    href: URLS.FAQ,
    alias: 'faq',
    title: 'FAQ',
  },
  {
    href: URLS.PAYMENT,
    alias: 'payment',
    title: 'Payment',
  },
  {
    href: URLS.SIGN_IN,
    alias: 'sign-in',
    title: 'Sign In',
    button: true,
  },
  {
    href: URLS.SIGN_UP,
    alias: 'sign-up',
    title: 'Sign Up',
    hidden: true,
  },
];
