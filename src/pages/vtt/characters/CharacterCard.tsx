import React from 'react';
import { Character } from '../types/Character';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import { useCharacterClient } from './character/useCharacterClient';
import { VLoader } from '@/components/VLoader';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';

const StyledCharacterCard = styled(VCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card__left {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.md};

    .left__name {
      font-weight: 600;
    }

    .left__description {
      color: ${props => props.theme.color.text.secondary};
      font-size: ${props => props.theme.variable.fontSize.sm};
    }
  }
`;

type CharacterCardProps = {
  character: Character;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const CharacterCard: React.FC<CharacterCardProps> = props => {
  const theme = useVTheme();

  const characterClient = useCharacterClient(props.character)!;

  return (
    <StyledCharacterCard onClick={props.onClick} disabled={props.disabled || props.loading}>
      {props.loading ? (
        <VFlex justify="center" style={{ flex: 1 }}>
          <VLoader style={{ padding: theme.variable.gap.md }} />
        </VFlex>
      ) : (
        <>
          <div className="card__left">
            <div className="left__name">{characterClient.name || 'Unnamed Character'}</div>
            <div className="left__description">
              {characterClient.race.name} {characterClient.class.name}
            </div>
          </div>

          <VNumberInput value={props.character.level} size={40} disabled />
        </>
      )}
    </StyledCharacterCard>
  );
};
