import React from 'react';
import { useEngineState } from '../EngineStateContext';
import { VCard } from '@/components/VCard';
import { VNumberInput } from '@/components/VNumberInput';
import styled from 'styled-components';

const StyledHitPointsCard = styled(VCard)`
  flex: 1;
  display: flex;
  align-items: center;

  .card__slash {
    font-size: 36px;
    font-weight: 200;
    padding-inline: 6px 3px;
  }

  .card__max {
    font-size: 24px;
  }
`;

export const HitPointsCard: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  const strengthAttribute = character.attributes.find(attribute => attribute.label === 'Strength');
  const fortitudeSkill = strengthAttribute?.skills.find(skill => skill.label === 'Fortitude');

  const strength = strengthAttribute?.value ?? 0;
  const fortitude = fortitudeSkill?.value ?? 0;

  const maxHitPoints = (character.level + strength + fortitude) * 6;

  return (
    <StyledHitPointsCard>
      <VNumberInput
        size={48}
        max={maxHitPoints}
        value={character.hitPoints}
        onChange={hitPoints => updateCharacter({ hitPoints })}
      />
      <div className="card__slash">/</div>
      <div className="card__max">{maxHitPoints}</div>
    </StyledHitPointsCard>
  );
};
