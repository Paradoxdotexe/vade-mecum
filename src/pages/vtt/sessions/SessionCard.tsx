import React from 'react';
import { Session } from '../types/Session';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { ReactComponent as UserIcon } from '@/icons/User.svg';

const StyledSessionCard = styled(VCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card__left {
    display: flex;
    gap: ${props => props.theme.variable.gap.sm};

    .left__name {
      font-weight: 600;
    }

    .left__id {
      color: ${props => props.theme.color.text.secondary};
      font-size: ${props => props.theme.variable.fontSize.sm};
    }
  }

  .card__right {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    font-family: ${props => props.theme.variable.fontFamily.display};
    font-size: ${props => props.theme.variable.fontSize.lg};

    svg {
      font-size: ${props => props.theme.variable.fontSize.md};
    }
  }
`;

type SessionCardProps = {
  session: Session;
};

export const SessionCard: React.FC<SessionCardProps> = props => {
  return (
    <StyledSessionCard>
      <div className="card__left">
        <div className="left__name">{props.session.name}</div>
        <div className="left__id">(#{props.session.id.split('-')[0]})</div>
      </div>

      <div className="card__right">
        {props.session.characterIds.length} <UserIcon />
      </div>
    </StyledSessionCard>
  );
};
