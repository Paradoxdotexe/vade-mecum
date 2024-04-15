import React, { useState } from 'react';
import { VCard } from '@/components/VCard';
import styled from 'styled-components';
import { useCharacters } from '../useCharacters';
import { Points } from './Points';
import { VButton } from '@/components/VButton';
import { VPopup } from '@/components/VPopup';
import { DiceFactor, RollCard } from '../RollCard';
import { RollEvaluation, useRolls } from '../useRolls';
import { DateTime } from 'luxon';
import { sum } from 'lodash-es';

const StyledSatiationCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .card__stats {
    display: flex;
    justify-content: space-between;

    .stats__stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      padding: 3px 0;
    }
  }
`;

export const SatiationCard: React.FC = () => {
  const { addRoll } = useRolls();
  const { currentCharacter } = useCharacters();

  const [resting, setResting] = useState(false);

  if (!currentCharacter) {
    return null;
  }

  const diceFactors: DiceFactor[] = [
    {
      type: 'A',
      label: 'Level',
      value: currentCharacter.level,
      disabled: true
    },
    {
      type: 'A',
      label: currentCharacter.attributes.strength.label,
      value: currentCharacter.attributes.strength.value,
      disabled: true
    },
    {
      type: 'A',
      label: currentCharacter.attributes.strength.skills.fortitude.label,
      value: currentCharacter.attributes.strength.skills.fortitude.value,
      disabled: true
    },
    {
      type: 'A',
      label: 'Bonus',
      value: 0
    }
  ];

  return (
    <>
      <StyledSatiationCard>
        <div className="card__stats">
          <div className="stats__stat">
            Satiation
            <Points
              max={4}
              value={currentCharacter.satiation}
              onChange={currentCharacter.setSatiation}
            />
          </div>
          <div className="stats__stat">
            Exhaustion
            <Points
              max={3}
              value={currentCharacter.exhaustion}
              onChange={currentCharacter.setExhaustion}
              type={'FAILURE'}
            />
          </div>
        </div>
        <VButton onClick={() => setResting(true)} disabled={!currentCharacter.satiation}>
          Rest
        </VButton>
      </StyledSatiationCard>
      <VPopup open={resting} onClose={() => setResting(false)}>
        <RollCard
          title={`${currentCharacter.name || 'Anonymous'} (Resting)`}
          diceFactors={diceFactors}
          evaluation={RollEvaluation.SUM}
          onRoll={dice => {
            addRoll({
              characterId: currentCharacter.id,
              label: 'Resting',
              dice,
              timestamp: DateTime.now().toISO(),
              evaluation: RollEvaluation.SUM
            });
            setTimeout(() => setResting(false), 1000);

            currentCharacter.setSatiation(currentCharacter.satiation - 1);
            currentCharacter.setHealthPoints(currentCharacter.healthPoints + sum(dice));
            currentCharacter.setExhaustion(0);
          }}
        />
      </VPopup>
    </>
  );
};
