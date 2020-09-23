export async function setToLocalStorage(
  key: string,
  values: string
): Promise<void> {
  window.localStorage.setItem(key, values);
}

export function getFromLocalStorage(key: string): string | null {
  return window.localStorage.getItem(key);
}

export function removeItemFromLocalStorage(key: string): void {
  window.localStorage.removeItem(key);
}

export function clearLocalStorage(): void {
  window.localStorage.clear();
}

export async function setToSessionStorage(
  key: string,
  values: string
): Promise<void> {
  window.sessionStorage.setItem(key, values);
}

export function getFromSessionStorage(key: string): string | null {
  return window.sessionStorage.getItem(key);
}

export function removeItemFromSessionStorage(key: string): void {
  window.localStorage.removeItem(key);
}

export function clearSessionStorage(): void {
  window.localStorage.clear();
}
