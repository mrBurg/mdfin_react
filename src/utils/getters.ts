import { TJSON } from '../interfaces';

export const jsonToQueryString = (json: TJSON, encode?: boolean): string =>
  (window.location.search ? '&' : '?') +
  Object.keys(json)
    .map((key) =>
      encode
        ? `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
        : `${key}=${json[key]}`
    )
    .join('&');
