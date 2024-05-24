import { isEqual } from 'lodash-es';
import { SetStateAction, useState, Dispatch, useMemo } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialState: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialState);
  const [loaded, setLoaded] = useState(false);

  // load state from localStorage
  useMemo(() => {
    const localStorageItem = localStorage.getItem(key);
    if (localStorageItem) {
      setState(JSON.parse(localStorageItem));
    }
    setLoaded(true);
  }, []);

  // push state to localStorage
  useMemo(() => {
    if (loaded) {
      if (!isEqual(state, initialState)) {
        localStorage.setItem(key, JSON.stringify(state));
      } else if (localStorage.getItem(key) != null) {
        localStorage.removeItem(key);
      }
    }
  }, [state, loaded]);

  return [state, setState];
};
