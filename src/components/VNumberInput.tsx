import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Input = styled.div<{ $width: number; $height: number; $fontSize: number }>`
  background: #585858;
  border-radius: 4px;

  input {
    font-family: 'Noto Sans Display', sans-serif;
    padding: 0;
    border: none;
    color: #fff;
    width: ${props => `${props.$width}px`};
    height: ${props => `${props.$height}px`};
    outline: none;
    text-align: center;
    font-size: ${props => `${props.$fontSize}px`};
    background: transparent;
    border-radius: 4px;

    &.input--error {
      border: 1px solid #ec4343;
      background-color: #ec434322;
    }
  }
`;

type VNumberInputProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: number;
};

export const VNumberInput: React.FC<VNumberInputProps> = props => {
  const [rawValue, setRawValue] = useState(props.value.toString());

  const min = props.min ?? 0;
  const max = props.max ?? 99;

  const size = props.size ?? 20;
  const height = size;
  const fontSize = size - 6;
  const width = Math.max(size, Math.ceil(fontSize * 0.67 * max.toString().length));

  const validated = useMemo(() => {
    const newValue = parseInt(rawValue);
    return !Number.isNaN(newValue) && newValue <= max && newValue >= min;
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
    <Input $width={width} $height={height} $fontSize={fontSize}>
      <input
        value={rawValue}
        onChange={event => setRawValue(event.target.value.slice(0, max.toString().length))}
        disabled={props.disabled}
        className={`${!validated ? 'input--error' : ''}`}
        onBlur={() => {
          if (!validated) {
            const newValue = parseInt(rawValue);
            if (Number.isNaN(newValue) || newValue < min) {
              setRawValue(min.toString());
            } else {
              setRawValue(max.toString());
            }
          }
        }}
      />
    </Input>
  );
};
