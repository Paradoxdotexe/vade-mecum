import React from 'react';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VCard } from '@/components/VCard';
import { useRollModal } from '@/pages/vtt/rolls/RollModal';
import { DiceFactor, RollEvaluation } from '@/pages/vtt/types/Roll';
import { AttributeKey } from '@/pages/vtt/types/Character';
import { CombatantClient } from '@/pages/vtt/sessions/session/encounter/useCombatantClient';
import { RollableSkill } from '@/pages/vtt/characters/character/cards/RollableSkill';

const StyledCombatantAttributeCard = styled(VCard)`
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

type CombatantAttributeCardProps = {
  combatantClient: CombatantClient;
  attributeKey: AttributeKey;
  onRoll: () => void;
};

export const CombatantAttributeCard: React.FC<CombatantAttributeCardProps> = props => {
  const rollModal = useRollModal();

  const attribute = props.combatantClient.attributes[props.attributeKey];
  const skills = attribute.skills;

  const onRoll = (skillKey: string) => {
    const skill = skills[skillKey];

    const diceFactors: DiceFactor[] = [
      {
        label: attribute.label,
        value: attribute.value
      }
    ];

    rollModal
      .open({
        characterId: '',
        characterName: props.combatantClient.name,
        label: skill.label,
        diceFactors,
        evaluation: RollEvaluation.CHECK
      })
      .then(() => props.onRoll());
  };

  return (
    <StyledCombatantAttributeCard>
      <div className="card__attribute">
        <div className="attribute__label">{attribute.label.toUpperCase()}</div>
        <VNumberInput value={attribute.value} min={1} max={6} size={48} disabled />
      </div>

      <div className="card__skills">
        {Object.entries(skills).map(([skillKey, skill]) => {
          return (
            <RollableSkill
              key={skillKey}
              label={skill.label}
              value={skill.value}
              max={3}
              disabled
              onClick={() => onRoll(skillKey)}
            />
          );
        })}
      </div>
    </StyledCombatantAttributeCard>
  );
};
