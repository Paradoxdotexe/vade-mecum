import React from 'react';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VCard } from '@/components/VCard';
import { AttributeKey } from '@/pages/engine/Character';
import { CharacterClient } from '../useCharacterClient';
import { RollableSkill } from './RollableSkill';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { DiceFactor, RollEvaluation } from '@/pages/vtt/types/Roll';

const StyledAttributeCard = styled(VCard)`
  display: flex;
  padding: 12px;

  .card__attribute {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.variable.gap.md};
    border-right: 1px solid ${props => props.theme.color.border.default};
    padding-right: 12px;

    .attribute__label {
      font-size: ${props => props.theme.variable.fontSize.xxs};
      text-align: center;
      width: 88px;
    }
  }

  .card__skills {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    gap: ${props => props.theme.variable.gap.sm};
    flex: 1;
  }
`;

type AttributeCardProps = {
  characterClient: CharacterClient;
  attributeKey: AttributeKey;
};

export const AttributeCard: React.FC<AttributeCardProps> = props => {
  const rollModal = useRollModal();

  const attribute = props.characterClient.attributes[props.attributeKey];

  const onRoll = (skillKey: string) => {
    const skill = attribute.skills[skillKey];

    const diceFactors: DiceFactor[] = [
      {
        label: attribute.label,
        value: attribute.value
      },
      {
        label: skill.label,
        value: skill.value
      }
    ];

    // add classItemBonus if applicable
    if (skillKey === props.characterClient.class.skillKey) {
      diceFactors.push({
        label: props.characterClient.class.classItemLabel,
        value: props.characterClient.class.classItemBonus
      });
    }

    if (skill)
      rollModal.open({
        characterId: props.characterClient.id,
        characterName: props.characterClient.name,
        label: skill.label,
        diceFactors,
        evaluation: RollEvaluation.CHECK
      });
  };

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
          <RollableSkill
            key={skillKey}
            label={skill.label}
            value={skill.value}
            max={3}
            onChange={value =>
              props.characterClient.setSkillValue(props.attributeKey, skillKey, value)
            }
            onClick={() => onRoll(skillKey)}
          />
        ))}
      </div>
    </StyledAttributeCard>
  );
};
