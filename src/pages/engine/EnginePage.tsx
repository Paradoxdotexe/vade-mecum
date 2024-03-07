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

  return (
    <Page>
      {/* <SkillCheckCard
        name="Character"
        diceFactors={[
          { type: 'A', label: 'Strength', value: 4, max: 6 },
          { type: 'A', label: 'Power', value: 1, max: 3 }
        ]}
      /> */}
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
          />
        ))}
      </div>
    </Page>
  );
};
