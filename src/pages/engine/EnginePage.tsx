import React, { useState } from 'react';
import styled from 'styled-components';
import { DiceRollCard } from './DiceRollCard';
import { AttributeSkillCard } from './AttributeSkillCard';
import { Attribute, useEngineState } from './EngineStateContext';

const Page = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .page__attributes {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: fit-content;
  }

  .page__rollLog {
    position: fixed;
    top: 0;
    right: 0;
    border-left: 1px solid #585858;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: -3px 6px 12px rgba(0, 0, 0, 0.1);
    width: 248px;

    .rollLog__header {
      display: flex;
      justify-content: center;
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 24px;
      padding: 24px;
      border-bottom: 1px solid #585858;
    }

    .rollLog__log {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      overflow: hidden;
      position: relative;
      flex: 1;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 80px;
        background-image: linear-gradient(#2c2c2c 0%, transparent 100%);
        z-index: 1;
      }

      .log__rolls {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 24px;
        padding: 24px;
        border-bottom: 1px solid #585858;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-gutter: stable both-edges;

        > div {
          flex-shrink: 0;
        }
      }

      .log__newRoll {
        padding-top: 24px;
        padding: 24px;
      }

      .log__hint {
        font-size: 12px;
        color: #a3a3a3;
        padding: 24px;
      }
    }
  }
`;

export const EnginePage: React.FC = () => {
  const engineState = useEngineState();
  const character = engineState.characters[0];

  const [newRollAttribute, setNewRollAttribute] = useState<Attribute>();

  const newRollLabel = `${character.name || 'Anonymous'} (${newRollAttribute?.skills[0].label})`;

  return (
    <Page>
      <div className="page__attributes">
        {character.attributes.map((attribute, i) => (
          <AttributeSkillCard
            key={attribute.label}
            attribute={attribute}
            onChange={attribute => {
              // update character attribute
              character.attributes.splice(i, 1, attribute);
              engineState.update({ characters: [character] });
            }}
            onClick={setNewRollAttribute}
          />
        ))}
      </div>
      <div className="page__rollLog">
        <div className="rollLog__header">Roll Log</div>
        <div className="rollLog__log">
          <div className="log__rolls">
            {engineState.diceRolls.map(diceRoll => (
              <DiceRollCard
                key={JSON.stringify(diceRoll)}
                label={diceRoll.label}
                roll={diceRoll.roll}
                minimized
              />
            ))}
          </div>
          {newRollAttribute ? (
            <div className="log__newRoll">
              <DiceRollCard
                key={newRollAttribute.skills[0].label}
                label={newRollLabel}
                diceFactors={[
                  {
                    type: 'A',
                    label: newRollAttribute.label,
                    value: newRollAttribute.value,
                    max: 6
                  },
                  {
                    type: 'A',
                    label: newRollAttribute.skills[0].label,
                    value: newRollAttribute.skills[0].value,
                    max: 3
                  }
                ]}
                onRoll={roll => {
                  const diceRoll = { label: newRollLabel, roll };
                  engineState.update({
                    diceRolls: [diceRoll, ...engineState.diceRolls]
                  });
                  setNewRollAttribute(undefined);
                }}
              />
            </div>
          ) : (
            <div className="log__hint">Click on a skill to roll</div>
          )}
        </div>
      </div>
    </Page>
  );
};
