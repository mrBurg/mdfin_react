import { TJSON } from '../interfaces';

export function setCookie(name: string, value: any, exdays: number): void {
  const data: string = `${name}=${value}`;
  const path: string = 'path=/';
  let expires: string = '';

  if (exdays) {
    const date: Date = new Date();

    date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);

    expires = 'expires=#{date.toUTCString()}';
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
