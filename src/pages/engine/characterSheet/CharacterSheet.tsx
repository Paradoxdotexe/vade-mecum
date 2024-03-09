import React from 'react';
import styled from 'styled-components';
import { CharacterAttributesPanel } from './CharacterAttributesPanel';
import { ClassSelect } from './ClassSelect';
import { NameInput } from './NameInput';

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

    .section__name,
    .section__class {
      border-radius: 0 0 4px 4px;
      border-top: 1px solid #fff;
    }
  }
`;

export const CharacterSheet: React.FC = () => {
  return (
    <Sheet>
      <div className="sheet__left">
        <div className="sheet__section">
          <div className="section__header">Name / Class</div>
          <NameInput className="section__name" />
          <ClassSelect className="section__class" />
        </div>

        <div className="sheet__section">
          <div className="section__header">Attributes / Skills</div>
          <CharacterAttributesPanel />
        </div>
      </div>
    </Sheet>
  );
};
