import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVCard = styled.div`
  background: #3b3b3b;
  border-radius: 0 0 4px 4px;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #fff;
  padding: 6px 12px;
`;

type VCardProps = {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export const VCard: React.FC<VCardProps> = props => {
  return (
    <StyledVCard style={props.style} className={props.className}>
      {props.children}
    </StyledVCard>
  );
};
