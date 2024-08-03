import classNames from 'classnames';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVTag = styled.div<{ $color?: string }>`
  font-family: ${props => props.theme.variable.fontFamily.default};
  font-size: ${props => props.theme.variable.fontSize.xs};
  padding: 3px 5px;
  border-radius: ${props => props.theme.variable.borderRadius};
  background-color: ${props => props.$color ?? props.theme.color.background.sunken};
  box-shadow: 2px 4px 16px ${props => props.theme.color.shadow.default};
  color: ${props => props.theme.color.text.contrast};
  line-height: 1;
  width: fit-content;

  &.tag--clickable {
    cursor: pointer;
  }
`;

type VTagProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  onClick?: () => void;
  title?: string;
};

export const VTag: React.FC<VTagProps> = props => {
  const className = classNames(props.className, {
    'tag--clickable': !!props.onClick
  });

  return (
    <StyledVTag
      title={props.title}
      className={className}
      style={props.style}
      $color={props.color}
      onClick={props.onClick}
    >
      {props.children}
    </StyledVTag>
  );
};
