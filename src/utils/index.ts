import { toJS } from 'mobx';
import { TCreateMarkup } from './@types';

export * from './localStorage';
export * from './environment';
export * from './molders';
export * from './cookies';
export * from './gettext';
export * from './handleErrors';
export * from './validators';
export * from './browser';
export * from './geolocation';

console.toJS = (data: any): void => {
  console.info(toJS(data));
};

export function createMarkup(__html: string): TCreateMarkup {
  return { __html };
}

export const delay = (() => {
  let counter = 0;

  return (callback: () => void, ms = 0) => {
    clearTimeout(counter);
    counter = window.setTimeout(callback, ms);
  };
})();
