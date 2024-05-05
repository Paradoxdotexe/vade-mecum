import { pulsingBackground } from '@/styles/pulsingBackground';
import React from 'react';
import styled from 'styled-components';

const StyledPoints = styled.div<{ $type: 'success' | 'failure' }>`
  display: flex;
  gap: 3px;

  .points__point {
    height: 10px;
    width: 10px;
    border-radius: 10px;
    background-color: ${props => props.theme.color.background.sunken};
    cursor: pointer;

    &.point--filled {
      ${props => pulsingBackground(props.theme.color.status[props.$type].border)}
    }
  }
`;

type PointsProps = {
  max: number;
  value: number;
  onChange: (value: number) => void;
  type?: 'success' | 'failure';
};

export const Points: React.FC<PointsProps> = props => {
  return (
    <StyledPoints $type={props.type ?? 'success'}>
      {[...new Array(props.max)].map((_, i) => (
        <div
          key={i}
          className={`points__point ${props.value > i ? 'point--filled' : ''}`}
          onClick={() => {
            if (i + 1 === props.value) {
              props.onChange(0);
            } else {
              props.onChange(i + 1);
            }
          }}
        />
      ))}
    </StyledPoints>
  );
};
