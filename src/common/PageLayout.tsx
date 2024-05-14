import { useBreakpoint } from '@/utils/useBreakpoint';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { TOP_NAV_HEIGHT } from './TopNav';

const StyledPageLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${props => props.theme.variable.gap.xl};

  .layout__content {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
  }
`;

type PageLayoutProps = {
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
};

export const PageLayout: React.FC<PageLayoutProps> = props => {
  const { isMobile } = useBreakpoint();

  return (
    <StyledPageLayout
      style={{
        minHeight: isMobile ? `calc(100vh - ${TOP_NAV_HEIGHT})` : '100vh'
      }}
    >
      <div className={`layout__content ${props.className}`} style={props.style}>
        {props.children}
      </div>
    </StyledPageLayout>
  );
};
