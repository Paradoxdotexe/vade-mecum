import React, { useState } from 'react';
import styled from 'styled-components';
import { AttributeCard } from './AttributeCard';
import { DiceFactor, RollCard } from '../RollCard';
import { VPopup } from '@/components/VPopup';
import { useCharacters } from '../useCharacters';
import { Attribute, AttributeKey } from '@/pages/engine/Character';
import { RollEvaluation, useRolls } from '../useRolls';
import { DateTime } from 'luxon';
import { InitiativeCard } from './InitiativeCard';

const StyledAttributeCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AttributeCards: React.FC = () => {
  const { addRoll } = useRolls();
  const { currentCharacter } = useCharacters();

  const [rolledAttribute, setRolledAttribute] = useState<Attribute>();
  const [rolledAttributeActive, setRolledAttributeActive] = useState(false);

  const rolledSkillKey = rolledAttribute && Object.keys(rolledAttribute.skills)[0];
  const rolledSkill = rolledSkillKey ? rolledAttribute.skills[rolledSkillKey] : undefined;

  const diceFactors: DiceFactor[] = [];

  if (rolledAttribute && rolledSkillKey && rolledSkill) {
    // add attribute and skill advantages
    diceFactors.push(
      {
        type: 'A',
        label: rolledAttribute.label,
        value: rolledAttribute.value,
        disabled: true
      },
      {
        type: 'A',
        label: rolledSkill.label,
        value: rolledSkill.value,
        disabled: true
      }
    );

    // add class item advantage if applicable
    if (currentCharacter.class?.skillKey === rolledSkillKey) {
      diceFactors.push({
        type: 'A',
        label: currentCharacter.class.classItemLabel,
        value: currentCharacter.class.classItemBonus,
        disabled: true
      });
    }

    diceFactors.push(
      { type: 'A', label: 'Advantage', value: 0 },
      { type: 'D', label: 'Disadvantage', value: 0 }
    );
  }

  return (
    <>
      <StyledAttributeCards>
        {Object.keys(currentCharacter.attributes).map(attributeKey => (
          <AttributeCard
            key={attributeKey}
            attributeKey={attributeKey as AttributeKey}
            onClick={attribute => {
              setRolledAttribute(attribute);
              setRolledAttributeActive(true);
            }}
          />
        ))}
        <InitiativeCard />
      </StyledAttributeCards>
      <VPopup
        open={rolledAttributeActive}
        onClose={() => {
          setRolledAttribute(undefined);
          setRolledAttributeActive(false);
        }}
      >
        <RollCard
          title={`${currentCharacter.name || 'Anonymous'} (${rolledSkill?.label})`}
          diceFactors={diceFactors}
          evaluation={RollEvaluation.CHECK}
          onRoll={dice => {
            addRoll({
              characterKey: currentCharacter.key,
              label: rolledSkill!.label,
              dice,
              timestamp: DateTime.now().toISO(),
              evaluation: RollEvaluation.CHECK
            });
            setTimeout(() => setRolledAttributeActive(false), 1500);
          }}
        />
      </VPopup>
    </>
  );
};
