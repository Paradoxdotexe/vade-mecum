import React from 'react';
import styled from 'styled-components';
import { NumberInput } from './NumberInput';
import { Attribute } from './EngineStateContext';

const Card = styled.div`
  background: #3b3b3b;
  border-radius: 4px;
  display: flex;
  padding: 12px;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);

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
    flex: 1;

    .skills__skill {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;

      .skill__label {
        flex: 1;
        padding-block: 3px;

        &:hover {
          color: #43a6ec;
          cursor: pointer;
        }
      }
    }
  }
`;

type AttributeSkillCardProps = {
  attribute: Attribute;
  onChange?: (attribute: Attribute) => void;
  onClick?: (attribute: Attribute) => void;
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
            props.onChange?.({ ...props.attribute, value });
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
                props.onChange?.({ ...props.attribute });
              }}
              max={3}
            />
            <div
              className="skill__label"
              onClick={() => props.onClick?.({ ...props.attribute, skills: [skill] })}
            >
              {skill.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
