import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVHeader = styled.div`
  font-family: 'Noto Sans Display', sans-serif;
  font-size: 18px;
  height: 18px;
  display: flex;
  align-items: center;
`;

type VHeaderProps = {
  children: ReactNode;
  className?: string;
};

export const VHeader: React.FC<VHeaderProps> = props => {
  return <StyledVHeader className={props.className}>{props.children}</StyledVHeader>;
};
