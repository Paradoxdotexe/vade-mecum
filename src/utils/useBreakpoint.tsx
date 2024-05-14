import { useEffect, useState } from 'react';

export const useBreakpoint = () => {
  const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(document.documentElement.clientWidth);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return {
    isMobile: windowWidth < 800
  };
};
