import React from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { useNavigate } from 'react-router-dom';
import { Encounter } from '../../types/Encounter';

const StyledEncounterCard = styled(VCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card__name {
    font-weight: 600;
  }
`;

type EncounterCardProps = {
  sessionId: string;
  encounter: Encounter;
};

export const EncounterCard: React.FC<EncounterCardProps> = props => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/vtt/sessions/${props.sessionId}/encounters/${props.encounter.id}`);
  };

  return (
    <StyledEncounterCard onClick={onClick}>
      <div className="card__name">{props.encounter.name || 'Unnamed Encounter'}</div>
    </StyledEncounterCard>
  );
};
