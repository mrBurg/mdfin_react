import { TJSON } from '../interfaces';

type TCookieData = string | number | object;

export function setCookie(
  name: string,
  value: any,
  cookieData?: TCookieData
): void {
  const date: Date = new Date();
  const data: string = `${name}=${value}`;
  let path: string = 'path=/';
  let expires: string = '';

  if (cookieData) {
    switch (cookieData.constructor) {
      case String:
        path = `path=${cookieData}`;
        break;
      case Number:
        date.setTime(date.getTime() + +cookieData * 24 * 60 * 60 * 1000);

        expires = `expires=${date.toUTCString()}`;
        break;
      case Object:
        // console.info('Object');
        break;
    }
  }

  document.cookie = `${data};${path};${expires}`;
}

export function getCookie(name: string): string | void {
  const cookies: TJSON = {};
  const cookiesData: Array<string> = decodeURIComponent(document.cookie).split(
    '; '
  );

  cookiesData.map((part: string) => {
    const cookiePart: Array<string> = part.split('=');

    cookies[cookiePart[0]] = cookiePart[1];
  });

  if (cookies.hasOwnProperty(name)) return cookies[name];
}

export function delCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
