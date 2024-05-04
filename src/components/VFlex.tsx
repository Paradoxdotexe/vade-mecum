import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVFlex = styled.div<{ $align?: string; $justify?: string; $vertical?: boolean }>`
  display: flex;
  align-items: ${props => props.$align};
  justify-content: ${props => props.$justify};
  flex-direction: ${props => (props.$vertical ? 'column' : 'row')};
`;

type VFlexProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  align?: 'center' | 'start' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  vertical?: boolean;
  gap?: number | string;
};

export const VFlex: React.FC<VFlexProps> = props => {
  return (
    <StyledVFlex
      className={props.className}
      style={{ gap: props.gap, ...props.style }}
      $align={props.align}
      $justify={props.justify}
      $vertical={props.vertical}
    >
      {props.children}
    </StyledVFlex>
  );
};
