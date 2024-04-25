import classNames from 'classnames';
import React, { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';

const StyledVCard = styled.div`
  background: ${props => props.theme.color.background.raised};
  border-bottom-left-radius: ${props => props.theme.variable.borderRadius};
  border-bottom-right-radius: ${props => props.theme.variable.borderRadius};
  box-shadow: 2px 4px 16px ${props => props.theme.color.shadow.default};
  border-top: 1px solid ${props => props.theme.color.border.bold};
  padding: ${props => props.theme.variable.gap.lg};

  &.card--clickable {
    cursor: pointer;

    &:hover {
      background: ${props => props.theme.color.background.hovered};
    }
  }
`;

type VCardProps = {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const VCard: React.FC<VCardProps> = props => {
  const className = classNames(props.className, {
    'card--clickable': !!props.onClick
  });

  return (
    <StyledVCard style={props.style} className={className} onClick={props.onClick}>
      {props.children}
    </StyledVCard>
  );
};
