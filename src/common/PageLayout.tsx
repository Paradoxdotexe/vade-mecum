import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledPageLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${props => props.theme.variable.gap.xl};
  min-height: 100vh;

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
};

export const PageLayout: React.FC<PageLayoutProps> = props => {
  return (
    <StyledPageLayout>
      <div className={`layout__content ${props.className}`}>{props.children}</div>
    </StyledPageLayout>
  );
};
