import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVHeader = styled.div`
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.variable.fontFamily.display};
  font-size: ${props => props.theme.variable.fontSize.lg};
  height: ${props => props.theme.variable.fontSize.lg};
`;

type VHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const VHeader: React.FC<VHeaderProps> = props => {
  return <StyledVHeader className={props.className}>{props.children}</StyledVHeader>;
};
