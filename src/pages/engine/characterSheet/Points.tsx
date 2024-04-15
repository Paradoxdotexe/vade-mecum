import { pulsingFailure, pulsingSuccess } from '@/styles/pulsingBackground';
import React from 'react';
import styled from 'styled-components';

const StyledPoints = styled.div<{ $type: 'SUCCESS' | 'FAILURE' }>`
  display: flex;
  gap: 3px;

  .points__point {
    height: 10px;
    width: 10px;
    border-radius: 6px;
    background-color: #585858;
    cursor: pointer;

    &.point--filled {
      ${props => (props.$type === 'SUCCESS' ? pulsingSuccess : pulsingFailure)}
    }
  }
`;

type PointsProps = {
  max: number;
  value: number;
  onChange: (value: number) => void;
  type?: 'SUCCESS' | 'FAILURE';
};

export const Points: React.FC<PointsProps> = props => {
  return (
    <StyledPoints $type={props.type ?? 'SUCCESS'}>
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
