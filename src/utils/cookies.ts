import { TJSON } from '../interfaces';

export function setCookie(name: string, value: any, exdays: number): void {
  let data: string = `${name}=${value}`;
  let path: string = 'path=/';
  let expires: string = '';

  if (exdays) {
    let date: Date = new Date();

    date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);

    expires = 'expires=#{date.toUTCString()}';
  }

  document.cookie = `${data};${path};${expires}`;
}

export function getCookie(name: string): string | void {
  let cookies: TJSON = {};
  let cookiesData: Array<string> = decodeURIComponent(document.cookie).split(
    '; '
  );

  cookiesData.map((part: string) => {
    let cookiePart: Array<string> = part.split('=');

    cookies[cookiePart[0]] = cookiePart[1];
  });

  if (cookies.hasOwnProperty(name)) return cookies[name];
}

export function delCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}
