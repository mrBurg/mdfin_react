type TRouter = {
  href: URLS;
  alias: string;
  title: string;
};

export enum URLS {
  HOME = '/',
  INFORMATION_FOR_CONSUMERS = '/information-for-consumers',
  FAQ = '/faq',
  REPAYMENT_BY_ANOTHER = '/repayment-by-another',
  USER = '/user',
  SIGNUP = '/signup',
  SIGNIN = '/signin',
  LOGOUT = '/logout',
  SSG = '/ssg',
  SSR = '/ssr',
}

export const mainMenu: Array<TRouter> = [
  {
    href: URLS.INFORMATION_FOR_CONSUMERS,
    alias: 'information-for-consumers',
    title: 'information-for-consumers',
  },
  {
    href: URLS.FAQ,
    alias: 'faq',
    title: 'faq',
  },
  {
    href: URLS.REPAYMENT_BY_ANOTHER,
    alias: 'repayment-by-another',
    title: 'repayment-by-another',
  },
];

export const testPages: Array<TRouter> = [
  {
    href: URLS.SSG,
    alias: 'ssg',
    title: 'ssg',
  },
  {
    href: URLS.SSR,
    alias: 'ssr',
    title: 'ssr',
  },
];
