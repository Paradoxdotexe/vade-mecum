import React from 'react';
import styled from 'styled-components';
import { SIDE_NAV_WIDTH, SideNav } from './SideNav';
import { Outlet } from 'react-router-dom';
import { VTTUserProvider } from './VTTUser';

const StyledPageWrapper = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
  padding-left: ${SIDE_NAV_WIDTH};
  background-color: ${props => props.theme.color.background.default};
  color: ${props => props.theme.color.text.primary};
  font-family: ${props => props.theme.variable.fontFamily.default};
  font-size: ${props => props.theme.variable.fontSize.md};
  line-height: 1;
  scrollbar-gutter: stable;

  * {
    box-sizing: border-box;
  }
`;

export const PageWrapper: React.FC = () => {
  return (
    <StyledPageWrapper>
      <VTTUserProvider>
        <SideNav />
        <Outlet />
      </VTTUserProvider>
    </StyledPageWrapper>
  );
};
