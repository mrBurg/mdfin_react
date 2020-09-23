import { toJS } from 'mobx';

export * from './localStorage';
export * from './environment';
export * from './molders';
export * from './cookies';
export * from './gettext';
export * from './handleErrors';
export * from './validators';

console.toJS = (data: any): void => {
  console.info(toJS(data));
};

export const delay: Function = (() => {
  let counter: number = 0;

  return (callback: Function, ms: number = 0) => {
    clearTimeout(counter);
    counter = setTimeout(callback, ms);
  };
})();
