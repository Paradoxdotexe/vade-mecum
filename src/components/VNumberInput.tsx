import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const StyledVNumberInput = styled.input<{ $width: number; $height: number; $fontSize: number }>`
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
  background: #585858;
  line-height: 1.4;

  &.input--error {
    border: 1px solid #ec4343;
    background-color: #ec434344;
  }

  &:disabled {
    pointer-events: none;
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
  const max = props.max;

  const size = props.size ?? 20;
  const height = size;
  const fontSize = size - 6;

  const characters = (max ? max.toString() : rawValue).length;
  const width = Math.max(size, Math.ceil(fontSize * 0.55 * characters) + 6);

  const validated = useMemo(() => {
    const newValue = parseInt(rawValue);
    return !Number.isNaN(newValue) && (!max || newValue <= max) && newValue >= min;
  }, [rawValue, max, min]);

  const onBlur = () => {
    const newValue = parseInt(rawValue);
    if (!validated) {
      if (Number.isNaN(newValue) || newValue < min || !max) {
        setRawValue(min.toString());
      } else {
        setRawValue(max.toString());
      }
    } else {
      setRawValue(newValue.toString());
    }
  };

  useEffect(() => onBlur(), [min, max]);

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
    <StyledVNumberInput
      $width={width}
      $height={height}
      $fontSize={fontSize}
      value={rawValue}
      onChange={event => {
        const value = event.target.value;
        setRawValue(max ? value.slice(0, characters) : value);
      }}
      disabled={props.disabled}
      className={`${!validated ? 'input--error' : ''}`}
      onBlur={onBlur}
    />
  );
};
