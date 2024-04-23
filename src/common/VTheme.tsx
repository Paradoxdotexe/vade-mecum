import React, { ReactNode, useContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const VARIABLES = {
  borderRadius: '3px',
  gap: {
    xs: '3px',
    sm: '6px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    xxl: '48px'
  },
  fontSize: {
    xs: '14px',
    sm: '15px',
    md: '16px',
    lg: '20px',
    xl: '28px',
    xxl: '56px'
  },
  fontFamily: {
    default: '"Noto Sans", sans-serif',
    bold: '"Noto Sans Display", sans-serif'
  },
  lineHeight: 1.5
};

const DARK_COLORS = {
  text: {
    primary: '#fafafa',
    secondary: '#808080',
    contrast: '#fafafa'
  },
  background: {
    default: '#2C2C2C',
    raised: '#3B3B3B',
    active: '#585858',
    hovered: '#474747',
    backdrop: '#0000007a'
  },
  border: {
    default: '#585858',
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
      text: '#34A9FE',
      background: '#34A9FE44',
      border: '#34A9FE'
    },
    failure: {
      text: '#F48E16',
      background: '#F48E1644',
      border: '#F48E16'
    },
    stalemate: {
      text: '#A1A1A1',
      background: '#A1A1A144',
      border: '#A1A1A1'
    },
    error: {
      text: '#ec4343',
      background: '#ec434344',
      border: '#ec4343'
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
