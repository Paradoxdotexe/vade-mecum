import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  border-radius: 4px;
  font-family: 'Noto Sans Display', sans-serif;
  width: 100%;
  z-index: 1;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  border: 1px solid #585858;
  padding: 0;
  font-size: 12px;
  user-select: none;

  &.button--primary {
    background: #34a9fe;
    border-color: #34a9fe;
  }

  &.button--large {
    font-size: 16px;
    padding: 9px 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background-color: rgba(0, 0, 0, 0.15);
    z-index: -1;
    transition: width ease 450ms;
  }

  &:hover::before {
    width: 100%;
  }
`;

type VButtonProps = {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  type?: 'default' | 'primary';
  size?: 'default' | 'large';
  onClick?: () => void;
};

export const VButton: React.FC<VButtonProps> = props => {
  return (
    <Button
      style={props.style}
      className={`${props.className} ${props.type === 'primary' ? 'button--primary' : ''} ${props.size === 'large' ? 'button--large' : ''}`}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};
