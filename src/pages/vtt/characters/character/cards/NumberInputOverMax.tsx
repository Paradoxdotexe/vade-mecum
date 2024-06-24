import { VNumberInput } from '@/components/VNumberInput';
import React from 'react';
import styled from 'styled-components';

const StyledNumberInputOverMax = styled.div`
  display: flex;
  align-items: center;

  .card__slash {
    font-weight: 200;
    padding-inline: ${props => props.theme.variable.gap.md} ${props => props.theme.variable.gap.sm};
  }
`;

type NumberInputOverMaxProps = {
  size: number;
  value: number;
  max: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

export const NumberInputOverMax: React.FC<NumberInputOverMaxProps> = props => {
  return (
    <StyledNumberInputOverMax onClick={event => event.stopPropagation()}>
      <VNumberInput
        size={props.size}
        max={props.max}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <div className="card__slash" style={{ fontSize: Math.round(props.size * (3 / 4)) }}>
        /
      </div>
      <div className="card__max" style={{ fontSize: Math.round(props.size / 2) }}>
        {props.max}
      </div>
    </StyledNumberInputOverMax>
  );
};
