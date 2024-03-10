import React, { useState } from 'react';
import styled from 'styled-components';
import { AttributeCard } from './AttributeCard';
import { RollCard } from '../RollCard';
import { VPopup } from '@/components/VPopup';
import { useCharacters } from '../useCharacters';
import { Attribute, AttributeKey } from '@/pages/engine/Character';
import { useRolls } from '../useRolls';
import { DateTime } from 'luxon';

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

  const rolledSkill = rolledAttribute && Object.values(rolledAttribute.skills)[0];

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
          diceFactors={
            rolledAttribute &&
            rolledSkill && [
              {
                type: 'A',
                label: rolledAttribute.label,
                value: rolledAttribute.value,
                max: 6
              },
              {
                type: 'A',
                label: rolledSkill.label,
                value: rolledSkill.value,
                max: 3
              }
            ]
          }
          onRoll={dice => {
            addRoll({
              characterKey: currentCharacter.key,
              label: rolledSkill!.label,
              dice,
              timestamp: DateTime.now().toISO()
            });
            setTimeout(() => setRolledAttributeActive(false), 1500);
          }}
        />
      </VPopup>
    </>
  );
};
