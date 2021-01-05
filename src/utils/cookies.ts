import { TJSON } from '@interfaces';
import _ from 'lodash';

type TCookieData = { path: string; expires: number };

export function setCookie(
  name: string,
  value: any,
  cookieData?: TCookieData | string | number
): void {
  const date: Date = new Date();
  const data = `${name}=${value}`;
  let cookiePath = 'path=/';
  let dateExpires = '';
  let cookie = {
    path: '',
    expires: 0,
  };

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
        cookie = <TCookieData>cookieData;

        if (cookie.path) cookiePath = cookie.path;
        if (cookie.expires) {
          date.setTime(date.getTime() + cookie.expires * 24 * 60 * 60 * 1000);

          dateExpires = `expires=${date.toUTCString()}`;
        }
        break;
    }
  }

  document.cookie = `${data};${cookiePath};${dateExpires}`;
}

export function getCookie(name: string): string | void {
  const cookies: TJSON = {};
  const cookiesData: string[] = decodeURIComponent(document.cookie).split('; ');

  _.map(cookiesData, (part: string): void => {
    const cookiePart: string[] = part.split('=');

    cookies[cookiePart[0]] = cookiePart[1];
  });

  if (cookies.hasOwnProperty.call(cookies, name)) return cookies[name];
}

export function delCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
