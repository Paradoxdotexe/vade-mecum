import React, { useState } from 'react';
import styled from 'styled-components';
import { DiceRollCard } from './DiceRollCard';
import { AttributeSkillCard } from './AttributeSkillCard';
import { Attribute, DEFAULT_CHARACTER, useEngineState } from './EngineStateContext';
import { ReactComponent as PlusIcon } from '../../icons/Plus.svg';
import { ReactComponent as TrashCanIcon } from '../../icons/TrashCan.svg';

const Page = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .page__tabs {
    display: flex;
    align-items: flex-end;
    height: 41px;
    gap: 6px;
    border-bottom: 1px solid #585858;
    width: fit-content;

    .tabs__tab {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #3b3b3b;
      border-radius: 6px 6px 0 0;
      padding: 12px;
      cursor: pointer;
      transition: all 150ms ease;
      border-top: 1px solid #585858;
      border-left: 1px solid #585858;
      border-right: 1px solid #585858;

      &:not(.tab--active) {
        opacity: 0.6;
        font-size: 14px;
        padding: 9px;

        &:hover {
          opacity: 0.8;
        }
      }

      svg {
        font-size: 12px;
      }

      .tab__delete {
        font-size: 18px;
        color: #a0a0a0;
        transition: color 150ms ease;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .page__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: fit-content;

    .section__header {
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 18px;
    }

    .section__name {
      background: #3b3b3b;
      border-radius: 0 0 4px 4px;
      padding: 6px 12px;
      box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
      border-top: 1px solid #fff;
      line-height: 1.4;

      input {
        padding: 0;
        border: none;
        color: #fff;
        outline: none;
        background: transparent;
        font-size: 16px;
        font-family: 'Noto Sans';
      }
    }

    .section__attributes {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
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

  const [newRollAttribute, setNewRollAttribute] = useState<Attribute>();
  const [characterIndex, setCharacterIndex] = useState(0);

  const character = engineState.characters[characterIndex];

  const newRollLabel = `${character.name || 'Anonymous'} (${newRollAttribute?.skills[0].label})`;

  const addCharacter = () => {
    engineState.update({
      characters: [...engineState.characters, structuredClone(DEFAULT_CHARACTER)]
    });
    setCharacterIndex(engineState.characters.length);
  };

  const removeCharacter = () => {
    engineState.characters.splice(characterIndex, 1);
    engineState.update({
      characters: [...engineState.characters]
    });
    setCharacterIndex(Math.max(0, characterIndex - 1));
  };

  return (
    <Page>
      <div className="page__tabs">
        {engineState.characters.map((character, i) => (
          <div
            key={i}
            className={`tabs__tab ${i === characterIndex ? 'tab--active' : ''}`}
            onClick={() => setCharacterIndex(i)}
          >
            {character.name || 'Anonymous'}
            {i === characterIndex && engineState.characters.length > 1 && (
              <TrashCanIcon
                className="tab__delete"
                onClick={event => {
                  event.stopPropagation();
                  removeCharacter();
                }}
              />
            )}
          </div>
        ))}
        <div className="tabs__tab" onClick={() => addCharacter()}>
          <PlusIcon />
        </div>
      </div>

      <div className="page__section">
        <div className="section__header">Name</div>
        <div className="section__name">
          <input
            value={character.name}
            onChange={event => {
              character.name = event.target.value;
              engineState.update({ characters: [...engineState.characters] });
            }}
            placeholder="Anonymous"
          />
        </div>
      </div>

      <div className="page__section">
        <div className="section__header">Attributes / Skills</div>
        <div className="section__attributes">
          {character.attributes.map((attribute, i) => (
            <AttributeSkillCard
              key={attribute.label}
              attribute={attribute}
              onChange={attribute => {
                // update character attribute
                character.attributes.splice(i, 1, attribute);
                engineState.update({ characters: [...engineState.characters] });
              }}
              onClick={setNewRollAttribute}
            />
          ))}
        </div>
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
                    diceRolls: [diceRoll, ...engineState.diceRolls].slice(0, 100)
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
