export type TCreateMarkup = {
  __html: string;
};

export type TGetSelectedData = { content: string; text: string };

export type THandleErrors = Promise<{ view: string } | boolean | void>;

export type TGetGeolocation = {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
} | void;

export type TGetBrowserData = {
  name: string;
  version: string | number | null;
  fullname: string;
};

export type TGetFromStorage = string | null;

export type TGetCookies = string | void;
