import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVCollapsible = styled.div<{ $collapsed: boolean }>`
  display: grid;
  transition: grid-template-rows 150ms ease;
  grid-template-rows: ${props => (props.$collapsed ? '0fr' : '1fr')};
  overflow: hidden;

  > div {
    grid-row: 1 / span 2;
  }
`;

type VCollapsibleProps = {
  children: ReactNode;
  collapsed: boolean;
};

export const VCollapsible: React.FC<VCollapsibleProps> = props => (
  <StyledVCollapsible $collapsed={props.collapsed}>
    <div>{props.children}</div>
  </StyledVCollapsible>
);
