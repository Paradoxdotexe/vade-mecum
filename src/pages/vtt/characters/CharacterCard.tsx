import React from 'react';
import { Character } from '../types/Character';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { WORLD_KITS } from '@/pages/engine/WorldKit';
import { VNumberInput } from '@/components/VNumberInput';
import { useNavigate } from 'react-router-dom';

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
};

export const CharacterCard: React.FC<CharacterCardProps> = props => {
  const navigate = useNavigate();

  const race = WORLD_KITS.vale_of_myths.races[props.character.raceKey];
  const characterClass = WORLD_KITS.vale_of_myths.classes[props.character.classKey];

  const onClick = () => {
    navigate(`/vtt/characters/${props.character.id}`);
  };

  return (
    <StyledCharacterCard onClick={onClick}>
      <div className="card__left">
        <div className="left__name">{props.character.name || 'Unnamed Character'}</div>
        <div className="left__description">
          {race.name} {characterClass.label}
        </div>
      </div>

      <VNumberInput value={props.character.level} size={40} disabled />
    </StyledCharacterCard>
  );
};
