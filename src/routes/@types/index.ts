import { BASE_URLS, CLIENT_URLS } from '..';

export type TRouter = {
  href: BASE_URLS | CLIENT_URLS;
  title: string;
  alias?: string;
  button?: boolean;
};
