import React from 'react';
import styled from 'styled-components';
import { ReactComponent as CheckIcon } from '@/icons/Check.svg';
import { ReactComponent as RefreshIcon } from '@/icons/Refresh.svg';

const StyledSavedStatus = styled.div<{ $saved: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.variable.gap.xs};
  color: ${props => props.theme.color.text.secondary};
  font-size: ${props => props.theme.variable.fontSize.sm};

  svg {
    transform: ${props => (!props.$saved ? 'scaleX(-100%)' : undefined)};
    animation: ${props => (!props.$saved ? 'rotate linear 2.5s infinite' : undefined)};

    @keyframes rotate {
      from {
        transform: scaleY(-100%) rotate(0deg);
      }
      to {
        transform: scaleY(-100%) rotate(-360deg);
      }
    }
  }
`;

type SavedStatusProps = {
  saved: boolean;
};

export const SavedStatus: React.FC<SavedStatusProps> = props => {
  return (
    <StyledSavedStatus $saved={props.saved}>
      {props.saved ? <CheckIcon /> : <RefreshIcon />}
      {props.saved ? 'Saved' : 'Saving'}
    </StyledSavedStatus>
  );
};
