import React, { useMemo } from 'react';

const parseVersion = (version: string) =>
  version.split('.').map(v => parseInt(v)) as [number, number];

export const useStateVersioner = <T extends { version: string }>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  defaultState: T
) => {
  useMemo(() => {
    const [majorVersion, minorVersion] = parseVersion(state.version);
    const [currentMajorVersion, currentMinorVersion] = parseVersion(defaultState.version);

    if (currentMajorVersion > majorVersion) {
      console.warn('Resetting state due to major version update.');
      setState(structuredClone(defaultState));
    } else if (currentMinorVersion > minorVersion) {
      console.warn('Updating state due to minor version update.');
      setState({
        ...structuredClone(defaultState),
        ...state,
        version: defaultState.version
      });
    }
  }, [state]);
};
