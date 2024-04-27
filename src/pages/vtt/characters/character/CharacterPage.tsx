import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useGetQuery } from '@/common/useGetQuery';
import { useParams } from 'react-router-dom';
import { Character } from '../../types/Character';
import { useCharacterClient } from './useCharacterClient';
import { NameCard } from './NameCard';
import styled from 'styled-components';
import { VHeader } from '@/components/VHeader';
import { VFlex } from '@/components/VFlex';
import { RaceCard } from './RaceCard';
import { ClassCard } from './ClassCard';
import { useVTheme } from '@/common/VTheme';
import { HealthPointsCard } from './HealthPointsCard';
import { SpeedCard } from './SpeedCard';
import { ClassPointsCard } from './ClassPointsCard';
import { LevelCard } from './LevelCard';
import { PartyGoalCard } from './PartyGoalCard';
import { PersonalGoalCard } from './PersonalGoalCard';

const StyledCharacterPage = styled(PageLayout)`
  .page__character {
    display: flex;
    gap: ${props => props.theme.variable.gap.lg};

    .character__left {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.lg};
      width: 250px; // TODO: Remove
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

  useEffect(() => {
    setCharacter(savedCharacter);
  }, [savedCharacter]);

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
          </div>
        </div>
      )}
    </StyledCharacterPage>
  );
};
