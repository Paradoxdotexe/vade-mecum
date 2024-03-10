import React, { useState } from 'react';
import { Attribute, DiceRoll, useEngineState } from '../EngineStateContext';
import styled from 'styled-components';
import { AttributeCard } from './AttributeCard';
import { DiceRollCard } from './DiceRollCard';
import { VPopup } from '../../../components/VPopup';

const StyledAttributeCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const AttributeCards: React.FC = () => {
  const { characterKey, character, updateCharacter, update, diceRolls } = useEngineState();

  const [rolledAttribute, setRolledAttribute] = useState<Attribute>();
  const [rolledAttributeActive, setRolledAttributeActive] = useState(false);

  const rolledAttributeType = rolledAttribute?.skills[0].label ?? '';

  return (
    <>
      <StyledAttributeCards>
        {character.attributes.map((attribute, i) => (
          <AttributeCard
            key={attribute.label}
            attribute={attribute}
            onChange={attribute => {
              // update character attribute
              const attributes = [...character.attributes];
              attributes[i] = attribute;
              updateCharacter({ attributes });
            }}
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
        <DiceRollCard
          label={`${character.name || 'Anonymous'} (${rolledAttributeType})`}
          diceFactors={
            rolledAttribute && [
              {
                type: 'A',
                label: rolledAttribute.label,
                value: rolledAttribute.value,
                max: 6
              },
              {
                type: 'A',
                label: rolledAttribute.skills[0].label,
                value: rolledAttribute.skills[0].value,
                max: 3
              }
            ]
          }
          onRoll={roll => {
            const diceRoll: DiceRoll = {
              characterKey,
              type: rolledAttributeType,
              roll
            };
            update({
              diceRolls: [diceRoll, ...diceRolls].slice(0, 100)
            });
            setTimeout(() => setRolledAttributeActive(false), 1500);
          }}
        />
      </VPopup>
    </>
  );
};
