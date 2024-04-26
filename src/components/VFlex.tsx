import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVFlex = styled.div<{ $vertical?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: ${props => (props.$vertical ? 'column' : 'row')};
`;

type VFlexProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  vertical?: boolean;
  gap?: number | string;
};

export const VFlex: React.FC<VFlexProps> = props => {
  return (
    <StyledVFlex
      className={props.className}
      style={{ gap: props.gap, ...props.style }}
      $vertical={props.vertical}
    >
      {props.children}
    </StyledVFlex>
  );
};
