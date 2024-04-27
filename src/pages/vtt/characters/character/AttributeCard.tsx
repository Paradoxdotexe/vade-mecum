import React from 'react';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VCard } from '@/components/VCard';
import { AttributeKey } from '@/pages/engine/Character';
import { CharacterClient } from './useCharacterClient';

const StyledAttributeCard = styled(VCard)`
  display: flex;
  padding: 12px ${props => props.theme.variable.gap.md};

  .card__attribute {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    border-right: 1px solid ${props => props.theme.color.border.default};
    width: 94px;
    padding-right: ${props => props.theme.variable.gap.md};

    .attribute__label {
      font-size: 12px;
    }
  }

  .card__skills {
    display: flex;
    flex-direction: column;
    padding-left: ${props => props.theme.variable.gap.md};
    gap: ${props => props.theme.variable.gap.sm};
    flex: 1;

    .skills__skill {
      display: flex;
      align-items: center;
      gap: ${props => props.theme.variable.gap.md};
      font-size: ${props => props.theme.variable.fontSize.xs};

      .skill__label {
        flex: 1;
        padding-block: 3px;
        transition: color ease 150ms;

        &:hover {
          color: ${props => props.theme.color.brand.default};
          cursor: pointer;
        }
      }
    }
  }
`;

type AttributeCardProps = {
  characterClient: CharacterClient;
  attributeKey: AttributeKey;
};

export const AttributeCard: React.FC<AttributeCardProps> = props => {
  const attribute = props.characterClient.attributes[props.attributeKey];

  return (
    <StyledAttributeCard>
      <div className="card__attribute">
        <div className="attribute__label">{attribute.label.toUpperCase()}</div>
        <VNumberInput
          value={attribute.value}
          onChange={value => props.characterClient.setAttributeValue(props.attributeKey, value)}
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
                props.characterClient.setSkillValue(props.attributeKey, skillKey, value)
              }
              max={3}
            />
            <div className="skill__label">{skill.label}</div>
          </div>
        ))}
      </div>
    </StyledAttributeCard>
  );
};
