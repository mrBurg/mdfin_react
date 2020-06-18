import { isBrowser } from './environment';

export async function setToLocalStorage(
  key: string,
  values: string
): Promise<void> {
  if (isBrowser) {
    window.localStorage.setItem(key, values);
  }
}

export function getFromLocalStorage(key?: string): string | null {
  if (isBrowser) {
    return window.localStorage.getItem(key!);
  }

  return null;
}

export function removeItemFromLocalStorage(key: string): void {
  if (isBrowser) {
    window.localStorage.removeItem(key);
  }
}

export function clearLocalStorage(): void {
  if (isBrowser) {
    window.localStorage.clear();
  }
}
