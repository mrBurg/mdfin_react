/// <reference types="next" />
/// <reference types="next/types/global" />

declare interface Window {
  requestIdleCallback: Function;
}

declare interface Console {
  toJS: (data: any) => void;
}

declare module '*.po' {
  const poModule: { [key: string]: string };

  export default poModule;
}

/* declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
} */

/* declare module '*.svg' {
  const content: string;
  export default content;
} */
