import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { SIDE_NAV_WIDTH, SideNav } from './SideNav';
import { Outlet } from 'react-router-dom';
import { VTTUserProvider } from './VTTUser';

const GlobalStyle = createGlobalStyle`
  html {
    background-color: ${props => props.theme.color.background.default};
    scrollbar-gutter: stable;
  }
`;

const StyledPageWrapper = styled.div`
  min-height: 100vh;
  overflow: auto;
  padding-left: ${SIDE_NAV_WIDTH};
  color: ${props => props.theme.color.text.primary};
  font-family: ${props => props.theme.variable.fontFamily.default};
  font-size: ${props => props.theme.variable.fontSize.md};
  line-height: 1;

  * {
    box-sizing: border-box;
  }
`;

export const PageWrapper: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <StyledPageWrapper>
        <VTTUserProvider>
          <SideNav />
          <Outlet />
        </VTTUserProvider>
      </StyledPageWrapper>
    </>
  );
};
