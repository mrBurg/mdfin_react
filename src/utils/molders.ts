import md5 from 'md5';
import _ from 'lodash';
import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import {
  PO_API_HOST,
  PO_API_PORT,
  PO_API,
  EVENT_PREFIXES,
} from '@src/constants';
import { TGetSelectedData } from './@types';
import { isDev, isTest } from './environment';

/**
 * @description Converts an object to a querystring
 * @param json JSON data to convert
 * @param encode Data encoding sign
 * @param symbol Beginning of the generated line
 * @type
 * json: TJSON,
 * encode?: boolean,
 * symbol?: string
 * @default
 * encode false
 * symbol '?'
 */
export const jsonToQueryString = (
  json: TJSON,
  ...restProps: (boolean | string)[]
): string => {
  let encode = false;
  let symbol = '?';

  for (const i of restProps) {
    switch (typeof i) {
      case 'boolean':
        encode = i;
        break;
      case 'string':
        symbol = i;
        break;
    }
  }

  return (
    symbol +
    _.map(json, (value: string, key: string) => {
      if (!value) return false;

      if (encode) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
      }

      return `${key}=${value}`;
    })
      .filter((value) => value)
      .join('&')
  );
};

export const makeStaticUri = (uri: URIS, port?: boolean): string => {
  const staticUri = !port ? PO_API_HOST : `${PO_API_HOST}:${PO_API_PORT}`;

  return staticUri + PO_API + uri;
};

export const makeApiUri = (port?: boolean): string => {
  const staticUri = !port ? PO_API_HOST : `${PO_API_HOST}:${PO_API_PORT}`;

  return staticUri + PO_API;
};

export const prefixedEvent = (
  element: HTMLElement,
  animationType: string,
  callback: (element: HTMLElement) => void
): HTMLElement => {
  _.map(EVENT_PREFIXES, (val: string, index: number, arr: string[]) => {
    if (!arr[index]) animationType = animationType.toLowerCase();

    element.addEventListener(val + animationType, () => {
      callback(element);
    });
  });

  return element;
};

export const getMD5 = (data: string): string => {
  if (isDev || isTest) return data;

  return md5(data);
};

export function divideDigits(number: number): string {
  return String(number).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}

export function getSelectedData(): TGetSelectedData {
  const selection = document.getSelection();
  let selectedData = { content: '', text: '' };

  if (selection && selection.anchorNode) {
    const {
      anchorNode: { textContent },
      anchorOffset,
      focusOffset,
    } = selection;
    if (textContent) {
      selectedData = {
        ...selectedData,
        content: textContent,
        text: textContent.slice(anchorOffset, focusOffset),
      };
    }
  }

  return selectedData;
}
