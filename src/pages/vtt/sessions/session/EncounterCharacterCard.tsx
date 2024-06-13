import React from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { useCharacterClient } from '@/pages/vtt/characters/character/useCharacterClient';
import { Character } from '@/pages/vtt/types/Character';
import { NumberInputOverMax } from '@/pages/vtt/characters/character/cards/NumberInputOverMax';
import { VTag } from '@/components/VTag';
import classNames from 'classnames';

const StyledEncounterCharacterCard = styled(VCard)`
  max-width: 400px;

  &.card--bloodied {
    border-color: ${props => props.theme.color.status.error.border};
    background-color: ${props => props.theme.color.status.error.background};

    input,
    .card__stat {
      background-color: ${props => props.theme.color.status.error.background};
    }
  }

  &.card--incapacitated {
    opacity: 0.6;
  }
`;

type EncounterCharacterCardProps = {
  character: Character;
  onClick?: () => void;
};

export const EncounterCharacterCard: React.FC<EncounterCharacterCardProps> = props => {
  const theme = useVTheme();

  const characterClient = useCharacterClient(props.character)!;

  const incapacitated = characterClient.healthPoints === 0;
  const bloodiedThreshold = characterClient.maxHealthPoints / 2;
  const bloodied = !incapacitated && characterClient.healthPoints <= bloodiedThreshold;

  const className = classNames({
    'card--bloodied': bloodied,
    'card--incapacitated': incapacitated
  });

  return (
    <StyledEncounterCharacterCard onClick={props.onClick} className={className}>
      <VFlex justify="space-between" align="center">
        <VFlex vertical gap={theme.variable.gap.md}>
          <div style={{ fontWeight: 600 }}>{characterClient.name || 'Unnamed Character'}</div>
          <VFlex gap={theme.variable.gap.md}>
            <VTag className="card__stat">
              <strong>INIT</strong> —
            </VTag>
            <VTag className="card__stat">
              <strong>SPEED</strong> {characterClient.speed * 5}ft
            </VTag>
          </VFlex>
        </VFlex>

        <NumberInputOverMax
          size={44}
          value={characterClient.healthPoints}
          onChange={characterClient.setHealthPoints}
          max={characterClient.maxHealthPoints}
          disabled
        />
      </VFlex>
    </StyledEncounterCharacterCard>
  );
};
