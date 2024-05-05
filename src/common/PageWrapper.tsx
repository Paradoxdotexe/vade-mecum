import React from 'react';
import styled from 'styled-components';
import { SIDE_NAV_WIDTH, SideNav } from './SideNav';
import { Outlet } from 'react-router-dom';
import { VTTUserProvider } from './VTTUser';
import { ROLL_LOG_WIDTH } from '@/pages/vtt/rolls/RollLog';

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

  &:has(#roll-log) {
    padding-right: ${ROLL_LOG_WIDTH};
  }

  &,
  * {
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 18px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.color.background.active};
      border: 5px solid transparent;
      border-radius: 20px;
      background-clip: content-box;
      opacity: 0;
    }
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.color.background.raised};
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
