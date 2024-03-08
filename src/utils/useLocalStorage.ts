import { SetStateAction, useState, Dispatch, useMemo } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialState: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialState);

  useMemo(() => {
    const localStorageItem = localStorage.getItem(key);
    if (localStorageItem) {
      setState(JSON.parse(localStorageItem));
    }
  }, []);

  useMemo(() => {
    if (state !== initialState) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState];
};
