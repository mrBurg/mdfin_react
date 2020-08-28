export * from './localStorage';
export * from './environment';
export * from './molders';
export * from './cookies';
export * from './gettext';

export const delay: Function = (() => {
  let counter: number = 0;

  return (callback: Function, ms: number = 0) => {
    clearTimeout(counter);
    counter = setTimeout(callback, ms);
  };
})();

export function withStore(store: any, callBack: Function) {
  if (store) return callBack(store);

  try {
    throw new Error('Received store does not exist');
  } catch (error) {
    console.info(error.message);
  }
}
