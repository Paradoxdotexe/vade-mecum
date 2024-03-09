import React from 'react';
import styled from 'styled-components';
import { useEngineState } from '../EngineStateContext';
import { CharacterAttributesPanel } from './CharacterAttributesPanel';

const Sheet = styled.div`
  display: flex;

  .sheet__left {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .sheet__section {
    display: flex;
    flex-direction: column;
    gap: 12px;

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
  }
`;

export const CharacterSheet: React.FC = () => {
  const { character, updateCharacter } = useEngineState();

  return (
    <Sheet>
      <div className="sheet__left">
        <div className="sheet__section">
          <div className="section__header">Name</div>
          <div className="section__name">
            <input
              value={character.name}
              onChange={event => updateCharacter({ name: event.target.value })}
              placeholder="Anonymous"
            />
          </div>
        </div>

        <div className="sheet__section">
          <div className="section__header">Attributes / Skills</div>
          <CharacterAttributesPanel />
        </div>
      </div>
    </Sheet>
  );
};
