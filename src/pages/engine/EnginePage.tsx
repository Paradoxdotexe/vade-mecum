import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SkillCheckCard } from './SkillCheckCard';
import { AttributeSkillCard } from './AttributeSkillCard';

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
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 24px;
        border-bottom: 1px solid #585858;
        width: 100%;
        overflow: auto;
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

export type Skill = {
  label: string;
  value: number;
};

export type Attribute = {
  label: string;
  value: number;
  skills: Skill[];
};

const DEFAULT_ATTRIBUTES: Attribute[] = [
  {
    label: 'Strength',
    value: 0,
    skills: [
      { label: 'Power', value: 0 },
      { label: 'Fortitude', value: 0 },
      { label: 'Athletics', value: 0 }
    ]
  },
  {
    label: 'Dexterity',
    value: 0,
    skills: [
      { label: 'Precision', value: 0 },
      { label: 'Stealth', value: 0 },
      { label: 'Agility', value: 0 }
    ]
  },
  {
    label: 'Intelligence',
    value: 0,
    skills: [
      { label: 'Comprehension', value: 0 },
      { label: 'Medicine', value: 0 },
      { label: 'Innovation', value: 0 }
    ]
  },
  {
    label: 'Persuasion',
    value: 0,
    skills: [
      { label: 'Intuition', value: 0 },
      { label: 'Speech', value: 0 },
      { label: 'Barter', value: 0 }
    ]
  },
  {
    label: 'Perception',
    value: 0,
    skills: [
      { label: 'Insight', value: 0 },
      { label: 'Detection', value: 0 },
      { label: 'Investigation', value: 0 }
    ]
  }
];

export const EnginePage: React.FC = () => {
  const [attributes, setAttributes] = useState(DEFAULT_ATTRIBUTES);
  const [newRollAttribute, setNewRollAttribute] = useState<Attribute>();
  const [diceRolls, setDiceRolls] = useState<number[][]>([]);

  return (
    <Page>
      <div className="page__attributes">
        {attributes.map((attribute, i) => (
          <AttributeSkillCard
            key={attribute.label}
            attribute={attribute}
            onChange={attribute => {
              // update attribute
              attributes.splice(i, 1, attribute);
              setAttributes([...attributes]);
            }}
            onClick={setNewRollAttribute}
          />
        ))}
      </div>
      <div className="page__rollLog">
        <div className="rollLog__header">Roll Log</div>
        <div className="rollLog__log">
          <div className="log__rolls">
            {diceRolls.map((diceRoll, i) => (
              <SkillCheckCard key={i} name="Character" minimized diceRoll={diceRoll} />
            ))}
          </div>
          {newRollAttribute ? (
            <div className="log__newRoll">
              <SkillCheckCard
                key={newRollAttribute.skills[0].label}
                name="Character"
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
                onRoll={diceRoll => {
                  setDiceRolls([...diceRolls, diceRoll]);
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
