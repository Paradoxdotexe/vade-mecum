import React from 'react';
import styled from 'styled-components';
import { NumberInput } from './NumberInput';
import { Attribute } from './EnginePage';

const Card = styled.div`
  background: #3b3b3b;
  border-radius: 4px;
  display: flex;
  padding: 12px;

  .card__attribute {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border-right: 1px solid #585858;
    width: 95px;
    padding-right: 12px;

    .attribute__label {
      font-size: 12px;
    }
  }

  .card__skills {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    gap: 6px;

    .skills__skill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
  }
`;

type AttributeSkillCardProps = {
  attribute: Attribute;
  onChange: (attribute: Attribute) => void;
};

export const AttributeSkillCard: React.FC<AttributeSkillCardProps> = props => {
  return (
    <Card>
      <div className="card__attribute">
        <div className="attribute__label">{props.attribute.label.toUpperCase()}</div>
        <NumberInput
          value={props.attribute.value}
          onChange={value => {
            // update attribute value
            props.onChange({ ...props.attribute, value });
          }}
          max={6}
          size={48}
        />
      </div>
      <div className="card__skills">
        {props.attribute.skills.map((skill, i) => (
          <div key={skill.label} className="skills__skill">
            <NumberInput
              value={skill.value}
              onChange={value => {
                // update skill value
                props.attribute.skills[i].value = value;
                props.onChange({ ...props.attribute });
              }}
              max={3}
            />
            {skill.label}
          </div>
        ))}
      </div>
    </Card>
  );
};
