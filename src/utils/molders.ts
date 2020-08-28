import md5 from 'md5';
import _ from 'lodash';

import { TJSON } from '../interfaces';
import { PO_API, PO_API_HOST, PO_API_PORT, eventPrefixes } from '../constants';
import { URIS } from '../routes';
import { isDev } from '.';

export const jsonToQueryString = (json: TJSON, encode?: boolean): string =>
  (window.location.search ? '&' : '?') +
  _.map(json, (value: string, key: string) => {
    if (encode) {
      key = encodeURIComponent(key);
      value = encodeURIComponent(value);
    }

    return `${key}=${value}`;
  }).join('&');

export const makeStaticUri = (uri: URIS, port?: boolean): string => {
  let staticUri = !port ? PO_API_HOST : `${PO_API_HOST}:${PO_API_PORT}`;

  return staticUri + PO_API + uri;
};

export const makeApiUri = (port?: boolean): string => {
  let staticUri = !port ? PO_API_HOST : `${PO_API_HOST}:${PO_API_PORT}`;

  return staticUri + PO_API;
};

export const prefixedEvent = (
  element: HTMLElement,
  animationType: string,
  callback: Function
) => {
  _.map(eventPrefixes, (val: string, index: number, arr: Array<string>) => {
    if (!arr[index]) animationType = animationType.toLowerCase();

    element.addEventListener(val + animationType, () => {
      callback(element);
    });
  });

  return element;
};

export const getMD5 = (data: string): string => {
  if (isDev) return data;

  return md5(data);
};

export function writeTag(string: string, tags: TJSON): string {
  _.map(tags, (val, key) => {
    const regExp = new RegExp(`\\\${${key}}`, 'gm');

    string = string.replace(regExp, val);
  });

  return string;
}

export function divideDigits(number: number) {
  return String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}
