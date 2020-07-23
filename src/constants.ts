export const PO_API: string = process.env.PO_API || '';
export const PO_STATIC: string = process.env.PO_STATIC || '';
export const HTTPS_HOST: string = process.env.HTTPS_HOST || '';
export const HTTPS_PORT: string = process.env.HTTPS_PORT || '';

export enum METHOD {
  GET = 'get',
  POST = 'post',
}

export enum BUTTON_TYPE {
  BUTTON = 'button',
  RESET = 'reset',
  SUBMIT = 'submit',
}

export enum INPUT_TYPE {
  TEXT = 'text',
}
