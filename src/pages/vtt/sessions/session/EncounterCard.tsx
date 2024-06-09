import React from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { useNavigate } from 'react-router-dom';
import { Encounter } from '../../types/Encounter';
import { VFlex } from '@/components/VFlex';
import { VLoader } from '@/components/VLoader';
import { useVTheme } from '@/common/VTheme';

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
  loading?: boolean;
};

export const EncounterCard: React.FC<EncounterCardProps> = props => {
  const navigate = useNavigate();
  const theme = useVTheme();

  const onClick = () => {
    navigate(`/vtt/sessions/${props.sessionId}/encounters/${props.encounter.id}`);
  };

  return (
    <StyledEncounterCard onClick={onClick}>
      {props.loading ? (
        <VFlex justify="center" style={{ flex: 1 }}>
          <VLoader style={{ padding: 0, marginBlock: -parseInt(theme.variable.gap.sm) }} />
        </VFlex>
      ) : (
        <div className="card__name">{props.encounter.name || 'Unnamed Encounter'}</div>
      )}
    </StyledEncounterCard>
  );
};
