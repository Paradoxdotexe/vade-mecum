import React from 'react';
import styled from 'styled-components';

const StyledVCheckbox = styled.input`
  position: relative;
  border: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: #585858;
  margin: 0;

  &:hover {
    cursor: pointer;
  }

  &:after {
    content: '';
    display: block;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 5px;
    opacity: 0;
    transition: opacity ease 50ms;
  }

  &:checked:after {
    opacity: 1;
  }
`;

type VCheckboxProps = {
  checked: boolean;
  onChecked?: (checked: boolean) => void;
};

export const VCheckbox: React.FC<VCheckboxProps> = props => {
  return (
    <StyledVCheckbox
      type="checkbox"
      checked={props.checked}
      onChange={event => props.onChecked?.(event.target.checked)}
    />
  );
};
