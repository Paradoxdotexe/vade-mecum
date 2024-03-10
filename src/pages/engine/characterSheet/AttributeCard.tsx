import React from 'react';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VCard } from '@/components/VCard';
import { Attribute, AttributeKey } from '@/pages/engine/Character';
import { useCharacters } from '../useCharacters';

const StyledAttributeCard = styled(VCard)`
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

type AttributeCardProps = {
  attributeKey: AttributeKey;
  onClick?: (attribute: Attribute) => void;
};

export const AttributeCard: React.FC<AttributeCardProps> = props => {
  const { currentCharacter } = useCharacters();

  const attribute = currentCharacter.attributes[props.attributeKey];

  return (
    <StyledAttributeCard>
      <div className="card__attribute">
        <div className="attribute__label">{attribute.label.toUpperCase()}</div>
        <VNumberInput
          value={attribute.value}
          onChange={value => currentCharacter.setAttributeValue(props.attributeKey, value)}
          min={1}
          max={6}
          size={48}
        />
      </div>

      <div className="card__skills">
        {Object.entries(attribute.skills).map(([skillKey, skill]) => (
          <div key={skill.label} className="skills__skill">
            <VNumberInput
              value={skill.value}
              onChange={value =>
                currentCharacter.setSkillValue(props.attributeKey, skillKey, value)
              }
              max={3}
            />
            <div
              className="skill__label"
              onClick={() =>
                props.onClick?.({
                  ...attribute,
                  skills: Object.fromEntries(
                    Object.entries(attribute.skills).filter(([key]) => key === skillKey)
                  )
                })
              }
            >
              {skill.label}
            </div>
          </div>
        ))}
      </div>
    </StyledAttributeCard>
  );
};
