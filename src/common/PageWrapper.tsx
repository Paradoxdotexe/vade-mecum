import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { SIDE_NAV_WIDTH, SideNav } from './SideNav';
import { Outlet } from 'react-router-dom';
import { VTTUserProvider } from './VTTUser';
import { ROLL_LOG_WIDTH } from '@/pages/vtt/rolls/RollLog';
import { TOP_NAV_HEIGHT, TopNav } from './TopNav';
import { useBreakpoint } from '@/utils/useBreakpoint';

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
      width: ${props => props.theme.variable.gap.lg};
    }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.color.background.active};
    border: ${props => props.theme.variable.gap.sm} solid transparent;
    border-radius: 20px;
    background-clip: content-box;
    opacity: 0;
  }

  body {
    background-color: ${props => props.theme.color.background.default};

    &::-webkit-scrollbar-track {
      background: ${props => props.theme.color.background.raised};
    }
  }
`;

const StyledPageWrapper = styled.div`
  overflow: auto;
  color: ${props => props.theme.color.text.primary};
  font-family: ${props => props.theme.variable.fontFamily.default};
  font-size: ${props => props.theme.variable.fontSize.md};
  line-height: 1;

  &:has(#roll-log) {
    padding-right: ${ROLL_LOG_WIDTH};
  }

  &:has(#side-nav) {
    padding-left: ${SIDE_NAV_WIDTH};
  }

  &:has(#top-nav) {
    padding-top: ${TOP_NAV_HEIGHT};
  }

  * {
    box-sizing: border-box;
  }
`;

export const PageWrapper: React.FC = () => {
  const { isMobile } = useBreakpoint();

  return (
    <>
      <GlobalStyle />
      <StyledPageWrapper>
        <VTTUserProvider>
          {isMobile ? <TopNav /> : <SideNav />}
          <Outlet />
        </VTTUserProvider>
      </StyledPageWrapper>
    </>
  );
};
