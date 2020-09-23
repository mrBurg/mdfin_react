import _ from 'lodash';

import { TJSON } from '../interfaces';

type TCookieData = { path: string; expires: number };

export function setCookie(
  name: string,
  value: any,
  cookieData?: TCookieData | string | number
): void {
  const date: Date = new Date();
  const data: string = `${name}=${value}`;
  let cookiePath: string = 'path=/';
  let dateExpires: string = '';

  if (cookieData) {
    switch (cookieData.constructor) {
      case String:
        cookiePath = `path=${cookieData}`;
        break;
      case Number:
        date.setTime(date.getTime() + +cookieData * 24 * 60 * 60 * 1000);

        dateExpires = `expires=${date.toUTCString()}`;
        break;
      case Object:
        const { path, expires } = <TCookieData>cookieData;

        if (path) cookiePath = path;
        if (expires) {
          date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);

          dateExpires = `expires=${date.toUTCString()}`;
        }
        break;
    }
  }

  document.cookie = `${data};${cookiePath};${dateExpires}`;
}

export function getCookie(name: string): string | void {
  const cookies: TJSON = {};
  const cookiesData: Array<string> = decodeURIComponent(document.cookie).split(
    '; '
  );

  _.map(cookiesData, (part: string): void => {
    const cookiePart: Array<string> = part.split('=');

    cookies[cookiePart[0]] = cookiePart[1];
  });

  if (cookies.hasOwnProperty(name)) return cookies[name];
}

export function delCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
