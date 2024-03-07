import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Input = styled.div<{ size: number }>`
  input {
    font-family: 'Noto Sans Display', sans-serif;
    padding: 0;
    border: none;
    color: #fff;
    width: ${props => `${props.size}px`};
    height: ${props => `${props.size}px`};
    background: #585858;
    border-radius: 4px;
    outline: none;
    text-align: center;
    font-size: ${props => `${props.size - 6}px`};

    &.input--error {
      border: 1px solid #ec4343;
    }
  }
`;

type NumberInputProps = {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  size?: number;
};

export const NumberInput: React.FC<NumberInputProps> = props => {
  const [rawValue, setRawValue] = useState(props.value.toString());

  const validated = useMemo(() => {
    const newValue = parseInt(rawValue);
    return !Number.isNaN(newValue) && (!props.max || newValue <= props.max);
  }, [rawValue]);

  useEffect(() => {
    const newValue = parseInt(rawValue);
    if (validated && props.value !== newValue) {
      props.onChange?.(newValue);
    }
  }, [rawValue]);

  useEffect(() => {
    if (props.value !== parseInt(rawValue)) {
      setRawValue(props.value.toString());
    }
  }, [props.value]);

  return (
    <Input size={props.size ?? 20}>
      <input
        value={rawValue}
        onChange={event => setRawValue(event.target.value.slice(0, 1))}
        disabled={props.disabled}
        className={`${!validated ? 'input--error' : ''}`}
      />
    </Input>
  );
};
