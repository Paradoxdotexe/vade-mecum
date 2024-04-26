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

const StyledCharacterPage = styled(PageLayout)`
  .page__character {
    display: flex;
    gap: ${props => props.theme.variable.gap.lg};

    .character__left {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.lg};
      width: 300px; // TODO: Remove
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
        </div>
      )}
    </StyledCharacterPage>
  );
};
