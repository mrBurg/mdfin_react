export const PO_API: string = process.env.PO_API || '';
export const PO_STATIC: string = process.env.PO_STATIC || '';
export const HTTP_HOST: string = process.env.HTTP_HOST || '';
export const HTTP_PORT: string = process.env.HTTP_PORT || '';
export const HTTPS_HOST: string = process.env.HTTP_HOST || '';
export const HTTPS_PORT: string = process.env.HTTP_PORT || '';

export enum METHOD {
  GET = 'get',
  POST = 'post',
}

export enum BUTTON_TYPE {
  BUTTON = 'button',
  RESET = 'reset',
  SUBMIT = 'submit',
}
