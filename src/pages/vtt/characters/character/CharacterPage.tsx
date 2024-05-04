import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton, VButtonProps } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useGetQuery } from '@/common/useGetQuery';
import { useParams } from 'react-router-dom';
import { AttributeKey, Character } from '../../types/Character';
import { useCharacterClient } from './useCharacterClient';
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

const EditButton: React.FC<VButtonProps> = props => (
  <VButton {...props} type="ghost" size="small">
    <EditIcon />
  </VButton>
);

const StyledCharacterPage = styled(PageLayout)`
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

export const CharacterPage: React.FC = () => {
  const { characterId } = useParams();
  const theme = useVTheme();

  const [character, setCharacter] = useState<Character>();
  const characterClient = useCharacterClient(character, setCharacter);

  const { data: savedCharacter } = useGetQuery<Character>(
    ['GET_CHARACTER', characterId],
    `/character/${characterId}`
  );

  useEffect(() => setCharacter(savedCharacter), [savedCharacter]);

  const [perksDrawerOpen, setPerksDrawerOpen] = useState(false);
  const [classAbilitiesDrawerOpen, setClassAbilitiesDrawerOpen] = useState(false);
  const [itemsDrawerOpen, setItemsDrawerOpen] = useState(false);

  return (
    <StyledCharacterPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Characters']}
        title={character?.name || 'Unnamed Character'}
        extra={
          <VButton>
            <TrashCanIcon /> Delete character
          </VButton>
        }
      />

      {characterClient && (
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
              <VHeader>Attributes / Skills</VHeader>
              {Object.keys(characterClient.attributes).map(key => (
                <AttributeCard
                  key={key}
                  characterClient={characterClient}
                  attributeKey={key as AttributeKey}
                />
              ))}
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
                <VFlex align="center" gap={theme.variable.gap.sm}>
                  Perks <EditButton onClick={() => setPerksDrawerOpen(true)} />
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
                <VFlex align="center" gap={theme.variable.gap.sm}>
                  Class Abilities <EditButton onClick={() => setClassAbilitiesDrawerOpen(true)} />
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
                <VFlex align="center" gap={theme.variable.gap.sm}>
                  Inventory <EditButton onClick={() => setItemsDrawerOpen(true)} />
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
    </StyledCharacterPage>
  );
};
