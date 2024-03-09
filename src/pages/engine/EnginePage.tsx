import React from 'react';
import styled from 'styled-components';
import { DiceRollCard } from './characterSheet/DiceRollCard';
import { useEngineState } from './EngineStateContext';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { CharacterSheet } from './characterSheet/CharacterSheet';

const Page = styled.div`
  padding: 48px;
  margin-right: 248px;
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
    background: #2c2c2c;

    .rollLog__header {
      display: flex;
      justify-content: center;
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 24px;
      padding: 18px;
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

      .log__hint {
        font-size: 12px;
        color: #a3a3a3;
        padding: 18px;
      }
    }
  }
`;

export const EnginePage: React.FC = () => {
  const { characters, characterKey, diceRolls, update, addCharacter, removeCharacter } =
    useEngineState();

  return (
    <Page>
      <div className="page__tabs">
        {Object.values(characters).map(character => (
          <div
            key={character.key}
            className={`tabs__tab ${character.key === characterKey ? 'tab--active' : ''}`}
            onClick={() => update({ characterKey: character.key })}
          >
            {character.name || 'Anonymous'}
            {character.key === characterKey && Object.keys(characters).length > 1 && (
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

      <CharacterSheet />

      <div className="page__rollLog">
        <div className="rollLog__header">Roll Log</div>
        <div className="rollLog__log">
          <div className="log__rolls">
            {diceRolls.map(diceRoll => (
              <DiceRollCard
                key={JSON.stringify(diceRoll)}
                label={`${characters[diceRoll.characterKey].name || 'Anonymous'} (${diceRoll.type})`}
                roll={diceRoll.roll}
                minimized
              />
            ))}
          </div>
          <div className="log__hint">Click on a skill to roll</div>
        </div>
      </div>
    </Page>
  );
};
