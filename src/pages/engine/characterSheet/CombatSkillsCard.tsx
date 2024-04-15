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

const StyledCombatSkillsCard = styled(VCard)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .card__sideSkill {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 14px;

    .sideSkill__label {
      padding-block: 3px;

      &:hover {
        color: #43a6ec;
        cursor: pointer;
      }
    }
  }
`;

export const CombatSkillsCard: React.FC = () => {
  const { addRoll } = useRolls();
  const { currentCharacter } = useCharacters();

  const [sideSkill, setSideSkill] = useState<'Initiative' | 'Looting'>();

  const diceFactors: DiceFactor[] = [];

  if (sideSkill === 'Initiative') {
    diceFactors.push(
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
    );

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
  } else if (sideSkill === 'Looting') {
    diceFactors.push(
      {
        type: 'A',
        label: 'Level',
        value: currentCharacter.level,
        disabled: true
      },
      {
        type: 'A',
        label: currentCharacter.attributes.charisma.skills.luck.label,
        value: currentCharacter.attributes.charisma.skills.luck.value,
        disabled: true
      }
    );
  }

  return (
    <>
      <StyledCombatSkillsCard>
        <div className="card__sideSkill">
          <VNumberInput value={currentCharacter.initiative} max={99} disabled />
          <div className="sideSkill__label" onClick={() => setSideSkill('Initiative')}>
            Initiative
          </div>
        </div>
        <div className="card__sideSkill">
          <VNumberInput value={currentCharacter.looting} max={99} disabled />
          <div className="sideSkill__label" onClick={() => setSideSkill('Looting')}>
            Looting
          </div>
        </div>
      </StyledCombatSkillsCard>
      <VPopup open={!!sideSkill} onClose={() => setSideSkill(undefined)}>
        <RollCard
          title={`${currentCharacter.name || 'Anonymous'} (${sideSkill})`}
          diceFactors={diceFactors}
          evaluation={RollEvaluation.SUM}
          onRoll={dice => {
            addRoll({
              characterId: currentCharacter.id,
              label: sideSkill ?? '',
              dice,
              timestamp: DateTime.now().toISO(),
              evaluation: RollEvaluation.SUM
            });
            setTimeout(() => setSideSkill(undefined), 1000);
          }}
        />
      </VPopup>
    </>
  );
};
