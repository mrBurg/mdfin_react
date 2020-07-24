import { TJSON } from '../interfaces';
import {
  HTTPS_HOST,
  PO_STATIC,
  PO_API,
  HTTPS_PORT,
  PO_API_HOST,
  PO_API_PORT,
  eventPrefixes,
} from '../constants';

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
  if (port) return `${PO_API_HOST}:${PO_API_PORT + PO_API}`;

  return PO_API_HOST + PO_API_PORT;
};

export const prefixedEvent = (
  element: any,
  transition: string,
  callback: Function
) => {
  for (let p in eventPrefixes) {
    if (!eventPrefixes[p]) {
      transition = transition.toLowerCase();
    }

    element.addEventListener(eventPrefixes[p] + transition, () => {
      callback(element);
    });
  }

  return element;
};
