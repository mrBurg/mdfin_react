import { BASE_URLS, CLIENT_URLS } from '@routes';

export type TRouter = {
  href: BASE_URLS | CLIENT_URLS;
  title: string;
  alias?: string;
  button?: boolean;
};
