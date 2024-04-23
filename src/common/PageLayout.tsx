import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledPageLayout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${props => props.theme.variable.gap.xl};

  .layout__content {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    width: 100%;
  }
`;

export const PageLayout: React.FC<{ children: ReactNode }> = props => {
  return (
    <StyledPageLayout>
      <div className="layout__content">{props.children}</div>
    </StyledPageLayout>
  );
};
