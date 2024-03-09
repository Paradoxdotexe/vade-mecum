import React from 'react';
import styled from 'styled-components';
import { CharacterAttributesPanel } from './CharacterAttributesPanel';
import { ClassSelect } from './ClassSelect';
import { NameInput } from './NameInput';
import { RaceSelect } from './RaceSelect';
import { DescriptionTextArea } from './DescriptionTextArea';

const Sheet = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  .sheet__left {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .sheet__right {
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex: 1;

    .right__top {
      display: flex;
      gap: 24px;
      height: 112px;
    }
  }

  .sheet__section {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &.section--flex {
      flex: 1;
    }

    .section__header {
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 18px;
    }

    .section__row {
      display: flex;
      gap: 12px;

      > * {
        flex: 1;
      }
    }
  }
`;

export const CharacterSheet: React.FC = () => {
  return (
    <Sheet>
      <div className="sheet__left">
        <div className="sheet__section">
          <div className="section__header">Name / Race / Class</div>
          <NameInput />
          <div className="section__row">
            <RaceSelect />
            <ClassSelect />
          </div>
        </div>

        <div className="sheet__section">
          <div className="section__header">Attributes / Skills</div>
          <CharacterAttributesPanel />
        </div>
      </div>

      <div className="sheet__right">
        <div className="right__top">
          <div className="sheet__section section--flex">
            <div className="section__header">Description</div>
            <DescriptionTextArea />
          </div>
        </div>
      </div>
    </Sheet>
  );
};
