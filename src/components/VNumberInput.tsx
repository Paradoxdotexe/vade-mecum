import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { VButton } from './VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '@/icons/Minus.svg';
import { minMax } from '@/utils/minMax';

const StyledVNumberInput = styled.div<{ $width: number; $height: number; $fontSize: number }>`
  display: flex;
  align-items: stretch;
  background: ${props => props.theme.color.background.sunken};
  border-radius: ${props => props.theme.variable.borderRadius};

  &.input--error {
    box-shadow: 0 0 0 1px ${props => props.theme.color.status.error.border};
    background-color: ${props => props.theme.color.status.error.background};
  }

  input {
    font-family: ${props => props.theme.variable.fontFamily.display};
    padding: 0;
    border: none;
    color: ${props => props.theme.color.text.primary};
    width: ${props => `${props.$width}px`};
    height: ${props => `${props.$height}px`};
    outline: none;
    text-align: center;
    font-size: ${props => `${props.$fontSize}px`};
    background: transparent;

    &:disabled {
      pointer-events: none;
    }
  }

  button {
    font-size: ${props => `${Math.round(props.$fontSize * 0.6)}px`} !important;
    padding: 0 !important;
    width: ${props => `${props.$width}px`};
    border: none;
    border-radius: 0;
    border-left: 1px solid ${props => props.theme.color.border.sunken};

    &:first-child {
      transform: scaleX(-100%);
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
  controls?: boolean;
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

  const onControlClick = (mod: 1 | -1) => {
    const value = parseInt(rawValue);
    setRawValue(minMax(value + mod, min, max ?? Number.POSITIVE_INFINITY).toString());
  };

  return (
    <StyledVNumberInput
      $width={width}
      $height={height}
      $fontSize={fontSize}
      className={`${!validated ? 'input--error' : ''}`}
    >
      {props.controls && (
        <VButton onClick={() => onControlClick(-1)}>
          <MinusIcon />
        </VButton>
      )}
      <input
        value={rawValue}
        onChange={event => {
          const value = event.target.value;
          setRawValue(max ? value.slice(0, characters) : value);
        }}
        disabled={props.disabled}
        onBlur={onBlur}
      />
      {props.controls && (
        <VButton onClick={() => onControlClick(1)}>
          <PlusIcon />
        </VButton>
      )}
    </StyledVNumberInput>
  );
};
