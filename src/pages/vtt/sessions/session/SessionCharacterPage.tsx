import React from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { useParams } from 'react-router-dom';
import { CharacterSheet } from '@/pages/vtt/characters/character/CharacterSheet';
import { useGetSessionQuery } from '@/pages/vtt/queries/useGetSessionQuery';
import { useSessionCharacter } from '../../queries/useSessionCharacter';

export const SessionCharacterPage: React.FC = () => {
  const { sessionId, characterId } = useParams();

  const { data: session } = useGetSessionQuery(sessionId);
  const { data: character } = useSessionCharacter(sessionId, characterId);

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={[
          'Virtual Tabletop',
          'Sessions',
          session ? session.name || 'Unnamed Session' : '...',
          'Characters'
        ]}
        title={character ? character.name || 'Unnamed Character' : ''}
      />

      <CharacterSheet character={character} />
    </PageLayout>
  );
};
