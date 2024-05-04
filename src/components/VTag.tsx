import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVTag = styled.div<{ $color?: string }>`
  font-family: ${props => props.theme.variable.fontFamily.default};
  font-size: ${props => props.theme.variable.fontSize.xs};
  padding: ${props => props.theme.variable.gap.sm};
  border-radius: ${props => props.theme.variable.borderRadius};
  background-color: ${props => props.$color ?? props.theme.color.brand.default};
  box-shadow: 2px 4px 16px ${props => props.theme.color.shadow.default};
`;

type VTagProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
};

export const VTag: React.FC<VTagProps> = props => {
  return (
    <StyledVTag className={props.className} style={props.style} $color={props.color}>
      {props.children}
    </StyledVTag>
  );
};
