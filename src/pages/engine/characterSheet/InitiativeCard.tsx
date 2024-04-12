import React, { useState } from 'react';
import { VCard } from '@/components/VCard';
import { useCharacters } from '../useCharacters';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { RollEvaluation, useRolls } from '../useRolls';
import { DateTime } from 'luxon';
import { DiceFactor, RollCard } from '../RollCard';
import { VPopup } from '@/components/VPopup';
import { parseComputation } from '@/utils/parseComputation';

const StyledInitiativeCard = styled(VCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;

  .card__label {
    padding-block: 3px;

    &:hover {
      color: #43a6ec;
      cursor: pointer;
    }
  }
`;

export const InitiativeCard: React.FC = () => {
  const { addRoll } = useRolls();
  const { currentCharacter } = useCharacters();

  const [rolledInitiativeActive, setRolledInitiativeActive] = useState(false);

  const diceFactors: DiceFactor[] = [
    {
      type: 'A',
      label: currentCharacter.attributes.dexterity.label,
      value: currentCharacter.attributes.dexterity.value,
      disabled: true
    },
    {
      type: 'A',
      label: currentCharacter.attributes.dexterity.skills.agility.label,
      value: currentCharacter.attributes.dexterity.skills.agility.value,
      disabled: true
    },
    {
      type: 'A',
      label: currentCharacter.attributes.perception.label,
      value: currentCharacter.attributes.perception.value,
      disabled: true
    },
    {
      type: 'A',
      label: currentCharacter.attributes.perception.skills.detection.label,
      value: currentCharacter.attributes.perception.skills.detection.value,
      disabled: true
    }
  ];

  // check for perk enhancement
  const initiativePerk = currentCharacter.perks.find(perk => perk.computed?.initiative);
  if (initiativePerk) {
    diceFactors.push({
      type: 'A',
      label: initiativePerk.name,
      value: parseComputation(initiativePerk.computed!.initiative!, { base: 0 }),
      disabled: true
    });
  }

  return (
    <>
      <StyledInitiativeCard>
        <VNumberInput value={currentCharacter.initiative} max={99} disabled />
        <div className="card__label" onClick={() => setRolledInitiativeActive(true)}>
          Combat Initiative
        </div>
      </StyledInitiativeCard>
      <VPopup open={rolledInitiativeActive} onClose={() => setRolledInitiativeActive(false)}>
        <RollCard
          title={`${currentCharacter.name || 'Anonymous'} (Initiative)`}
          diceFactors={diceFactors}
          evaluation={RollEvaluation.SUM}
          onRoll={dice => {
            addRoll({
              characterKey: currentCharacter.key,
              label: 'Initiative',
              dice,
              timestamp: DateTime.now().toISO(),
              evaluation: RollEvaluation.SUM
            });
            setTimeout(() => setRolledInitiativeActive(false), 1500);
          }}
        />
      </VPopup>
    </>
  );
};
