import { lighten, opacify } from 'polished';
import React, { ReactNode, useContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const VARIABLES = {
  borderRadius: '4px',
  gap: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '32px',
    xxl: '64px'
  },
  fontSize: {
    xxs: '13px',
    xs: '14px',
    sm: '15px',
    md: '16px',
    lg: '18px',
    xl: '28px',
    xxl: '56px'
  },
  fontFamily: {
    default: '"Noto Sans", sans-serif',
    display: '"Noto Sans Display", sans-serif',
    mono: '"Noto Sans Mono", monospace'
  },
  lineHeight: 1.5
};

const DARK_COLORS = {
  text: {
    primary: '#fafafa',
    secondary: '#8d8d8d',
    tertiary: '#747474',
    contrast: '#fafafa'
  },
  background: {
    default: '#2C2C2C',
    raised: '#3B3B3B',
    sunken: '#585858',
    active: '#585858',
    hovered: '#454545',
    backdrop: '#0000007a'
  },
  border: {
    default: '#585858',
    sunken: '#6d6d6d',
    bold: '#fafafa'
  },
  shadow: {
    default: '#00000018'
  },
  brand: {
    default: '#34A9FE'
  },
  status: {
    success: {
      text: lighten(0.1, '#2fa4f8'),
      background: opacify(-0.7, '#2fa4f8'),
      border: '#2fa4f8'
    },
    failure: {
      text: lighten(0.1, '#ee7f00'),
      background: opacify(-0.7, '#ee7f00'),
      border: '#ee7f00'
    },
    stalemate: {
      text: lighten(0.1, '#979797'),
      background: opacify(-0.7, '#979797'),
      border: '#979797'
    },
    error: {
      text: lighten(0.1, '#e62020'),
      background: opacify(-0.7, '#e62020'),
      border: '#e62020'
    }
  }
};

export type VTheme = {
  color: typeof DARK_COLORS;
  variable: typeof VARIABLES;
};

const COLOR_MODES = {
  dark: DARK_COLORS
};

type ColorModeKey = keyof typeof COLOR_MODES;

interface VTC extends VTheme {
  key: ColorModeKey;
  update: (key: ColorModeKey) => void;
}

const VThemeContext = React.createContext<VTC>({
  color: DARK_COLORS,
  variable: VARIABLES,
  key: 'dark',
  update: () => {}
});

export const VThemeProvider: React.FC<{ children?: ReactNode }> = props => {
  const [key, setKey] = useState<ColorModeKey>('dark');

  const theme: VTheme = {
    color: COLOR_MODES[key],
    variable: VARIABLES
  };

  const authStateContext: VTC = {
    ...theme,
    key,
    update: setKey
  };

  return (
    <VThemeContext.Provider value={authStateContext}>
      <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
    </VThemeContext.Provider>
  );
};

export const useVTheme = () => {
  return useContext(VThemeContext);
};
