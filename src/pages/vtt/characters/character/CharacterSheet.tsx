import React, { useState } from 'react';
import { VButton, VButtonProps } from '@/components/VButton';
import { ReactComponent as WeightIcon } from '@/icons/Weight.svg';
import { AttributeKey, Character } from '../../types/Character';
import { CharacterClient, useCharacterClient } from './useCharacterClient';
import { NameCard } from './cards/NameCard';
import styled from 'styled-components';
import { VHeader } from '@/components/VHeader';
import { VFlex } from '@/components/VFlex';
import { RaceCard } from './cards/RaceCard';
import { ClassCard } from './cards/ClassCard';
import { useVTheme } from '@/common/VTheme';
import { HealthPointsCard } from './cards/HealthPointsCard';
import { SpeedCard } from './cards/SpeedCard';
import { ClassPointsCard } from './cards/ClassPointsCard';
import { LevelCard } from './cards/LevelCard';
import { PartyGoalCard } from './cards/PartyGoalCard';
import { PersonalGoalCard } from './cards/PersonalGoalCard';
import { AttributeCard } from './cards/AttributeCard';
import { PerksCard } from './cards/PerksCard';
import { PerksDrawer } from './drawers/PerksDrawer';
import { ReactComponent as EditIcon } from '@/icons/Edit.svg';
import { ClassAbilitiesCard } from './cards/ClassAbilitiesCard';
import { ClassAbilitiesDrawer } from './drawers/ClassAbilitiesDrawer';
import { InventoryCard } from './cards/InventoryCard';
import { ItemsDrawer } from './drawers/ItemsDrawer';
import { SatiationExhaustionCard } from './cards/SatiationExhaustionCard';
import { pluralize } from '@/utils/pluralize';
import { pulsingBackground } from '@/styles/pulsingBackground';
import { VTag } from '@/components/VTag';
import { ComputedSkillsCard } from './cards/ComputedSkillsCard';
import { VLoader } from '@/components/VLoader';

const StyledCharacterSheet = styled.div`
  .page__character {
    display: flex;
    gap: ${props => props.theme.variable.gap.lg};

    .character__left {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.lg};
    }

    .character__right {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.lg};
      flex: 1;

      .right__top {
        display: flex;
        gap: ${props => props.theme.variable.gap.lg};
        height: 102px;
      }

      .right__bottom {
        display: flex;
        flex-direction: column;
        gap: ${props => props.theme.variable.gap.lg};
      }
    }

    .character__section {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.md};
    }
  }
`;

type CharacterSheetProps = {
  character: Character | undefined;
  setCharacter?: React.Dispatch<React.SetStateAction<Character | undefined>>;
};

export const CharacterSheet: React.FC<CharacterSheetProps> = props => {
  const theme = useVTheme();

  const characterClient = useCharacterClient(props.character, props.setCharacter);

  const [perksDrawerOpen, setPerksDrawerOpen] = useState(false);
  const [classAbilitiesDrawerOpen, setClassAbilitiesDrawerOpen] = useState(false);
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState(false);

  const disabled = !props.setCharacter;

  return (
    <StyledCharacterSheet style={{ pointerEvents: disabled ? 'none' : undefined }}>
      {!characterClient ? (
        <VFlex justify="center">
          <VLoader />
        </VFlex>
      ) : (
        <div className="page__character">
          <div className="character__left">
            <div className="character__section">
              <VHeader>Name / Race / Class</VHeader>
              <NameCard characterClient={characterClient} />
              <VFlex gap={theme.variable.gap.md}>
                <RaceCard characterClient={characterClient} style={{ flex: 1 }} />
                <ClassCard characterClient={characterClient} style={{ flex: 1 }} />
              </VFlex>
            </div>

            <div className="character__section">
              <VHeader>
                <VFlex align="center" justify="space-between" style={{ width: '100%' }}>
                  Attributes / Skills
                  <AcquisitionIndicator
                    label={!characterClient.attributePointsToAcquire ? 'skill' : 'attribute'}
                    count={
                      characterClient.attributePointsToAcquire ||
                      characterClient.skillPointsToAcquire
                    }
                  />
                </VFlex>
              </VHeader>
              {Object.keys(characterClient.attributes).map(key => (
                <AttributeCard
                  key={key}
                  characterClient={characterClient}
                  attributeKey={key as AttributeKey}
                />
              ))}
              <ComputedSkillsCard characterClient={characterClient} />
            </div>
            <div className="character__section">
              <VHeader>Satiation / Exhaustion</VHeader>
              <SatiationExhaustionCard characterClient={characterClient} />
            </div>
          </div>

          <div className="character__right">
            <div className="right__top">
              <div className="character__section" style={{ flex: 1 }}>
                <VHeader>Party Goal / Personal Goal</VHeader>
                <PartyGoalCard characterClient={characterClient} />
                <PersonalGoalCard characterClient={characterClient} />
              </div>

              <div className="character__section">
                <VHeader>Level</VHeader>
                <LevelCard characterClient={characterClient} />
              </div>

              <div className="character__section">
                <VHeader>Health Points</VHeader>
                <HealthPointsCard characterClient={characterClient} />
              </div>

              <div className="character__section">
                <VHeader>Speed</VHeader>
                <SpeedCard characterClient={characterClient} />
              </div>

              {!!characterClient.maxClassPoints && (
                <div className="character__section">
                  <VHeader>Class Points</VHeader>
                  <ClassPointsCard characterClient={characterClient} />
                </div>
              )}
            </div>

            <div className="character__section">
              <VHeader>
                <VFlex align="center" justify="space-between" style={{ width: '100%' }}>
                  <VFlex align="center" gap={theme.variable.gap.sm}>
                    Perks {!disabled && <EditButton onClick={() => setPerksDrawerOpen(true)} />}
                  </VFlex>
                  <AcquisitionIndicator label="perk" count={characterClient.perksToAcquire} />
                </VFlex>
              </VHeader>
              <PerksCard characterClient={characterClient} />
              <PerksDrawer
                open={perksDrawerOpen}
                onClose={() => setPerksDrawerOpen(false)}
                characterClient={characterClient}
              />
            </div>

            <div className="character__section">
              <VHeader>
                <VFlex align="center" justify="space-between" style={{ width: '100%' }}>
                  <VFlex align="center" gap={theme.variable.gap.sm}>
                    Class Abilities{' '}
                    {!disabled && <EditButton onClick={() => setClassAbilitiesDrawerOpen(true)} />}
                  </VFlex>
                  <AcquisitionIndicator
                    label="class ability"
                    count={characterClient.classAbilitiesToAcquire}
                  />
                </VFlex>
              </VHeader>
              <ClassAbilitiesCard characterClient={characterClient} />
              <ClassAbilitiesDrawer
                open={classAbilitiesDrawerOpen}
                onClose={() => setClassAbilitiesDrawerOpen(false)}
                characterClient={characterClient}
              />
            </div>

            <div className="character__section">
              <VHeader>
                <VFlex align="center" justify="space-between" style={{ width: '100%' }}>
                  <VFlex align="center" gap={theme.variable.gap.sm}>
                    Inventory {!disabled && <EditButton onClick={() => setItemsDrawerOpen(true)} />}
                  </VFlex>
                  <ItemWeight characterClient={characterClient} />
                </VFlex>
              </VHeader>
              <InventoryCard characterClient={characterClient} />
              <ItemsDrawer
                open={itemsDrawerOpen}
                onClose={() => setItemsDrawerOpen(false)}
                characterClient={characterClient}
              />
            </div>
          </div>
        </div>
      )}
    </StyledCharacterSheet>
  );
};

const EditButton: React.FC<VButtonProps> = props => (
  <VButton {...props} type="ghost" size="small">
    <EditIcon />
  </VButton>
);

const ItemWeight: React.FC<{ characterClient: CharacterClient }> = props => {
  const theme = useVTheme();

  const { itemWeight, carryingCapacity } = props.characterClient;

  const overCarryingCapacity = itemWeight > carryingCapacity;

  return (
    <VFlex
      align="center"
      gap={theme.variable.gap.sm}
      style={{
        color: overCarryingCapacity ? theme.color.status.failure.text : undefined
      }}
    >
      {itemWeight.toFixed(2)} / {carryingCapacity.toFixed(2)}
      <WeightIcon fontSize={20} />
    </VFlex>
  );
};

const StyledAcquisitionIndicator = styled(VTag)<{ $success: boolean }>`
  ${props =>
    pulsingBackground(props.theme.color.status[props.$success ? 'success' : 'failure'].border)}
`;

const AcquisitionIndicator: React.FC<{ label: string; count: number }> = props => {
  if (props.count === 0) return null;
  return (
    <StyledAcquisitionIndicator $success={props.count > 0}>
      {props.count > 0 ? '+' : '-'}
      {Math.abs(props.count)} {pluralize(props.label, Math.abs(props.count))}
    </StyledAcquisitionIndicator>
  );
};
