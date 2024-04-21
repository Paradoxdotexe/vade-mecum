import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledVInput = styled.input`
  padding: 6px 12px;
  border: none;
  color: #fff;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: 'Noto Sans';
  width: 100%;

  &::placeholder {
    color: #747474;
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
