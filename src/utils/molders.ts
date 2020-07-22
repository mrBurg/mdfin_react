import { TJSON } from '../interfaces';
import { HTTPS_HOST, PO_STATIC, PO_API, HTTPS_PORT } from '../constants';

export const jsonToQueryString = (json: TJSON, encode?: boolean): string =>
  (window.location.search ? '&' : '?') +
  Object.keys(json)
    .map((key) =>
      encode
        ? `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
        : `${key}=${json[key]}`
    )
    .join('&');

export const makeStaticUrl = (port?: boolean): string => {
  if (port) return `${HTTPS_HOST}:${HTTPS_PORT + PO_STATIC}`;

  return HTTPS_HOST + PO_STATIC;
};

export const makeApiUrl = (port?: boolean): string => {
  if (port) return `${HTTPS_HOST}:${HTTPS_PORT + PO_STATIC}`;

  return HTTPS_HOST + PO_API;
};
