import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledVInput = styled.input`
  padding-block: ${props => parseInt(props.theme.variable.gap.md) - 3}px;
  padding-inline: ${props => props.theme.variable.gap.md};
  border: none;
  color: ${props => props.theme.color.text.primary};
  outline: none;
  background: transparent;
  font-size: ${props => props.theme.variable.fontSize.md};
  font-family: ${props => props.theme.variable.fontFamily.default};
  width: 100%;

  &::placeholder {
    color: ${props => props.theme.color.text.tertiary};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

type VInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  onEnter?: () => void;
};

export const VInput: React.FC<VInputProps> = props => {
  const [value, setValue] = useState(props.value ?? '');

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value ?? '');
    }
  }, [props.value]);

  useEffect(() => {
    if (value !== props.value) {
      props.onChange?.(value);
    }
  }, [value]);

  return (
    <StyledVInput
      value={value}
      onChange={event => setValue(event.target.value)}
      placeholder={props.placeholder}
      spellCheck="false"
      disabled={props.disabled}
      onKeyUp={event => {
        event.code === 'Enter' && props.onEnter?.();
      }}
    />
  );
};
