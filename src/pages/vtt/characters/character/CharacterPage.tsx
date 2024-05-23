import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useParams } from 'react-router-dom';
import { Character } from '../../types/Character';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { debounce, isEqual } from 'lodash-es';
import { SavedStatus } from '../../SavedStatus';
import { useGetCharacterQuery } from '../../queries/useGetCharacterQuery';
import { useUpdateCharacterMutation } from '../../queries/useUpdateCharacterMutation';
import { RollLog } from '../../rolls/RollLog';
import { DeleteCharacterModal } from './DeleteCharacterModal';
import { CharacterSheet } from './CharacterSheet';

export const CharacterPage: React.FC = () => {
  const { characterId } = useParams();
  const theme = useVTheme();

  const [character, setCharacter] = useState<Character>();
  const [saved, setSaved] = useState(true);

  const [deleteCharacterModalOpen, setDeleteCharacterModalOpen] = useState(false);

  const { data: savedCharacter } = useGetCharacterQuery(characterId);
  useMemo(() => {
    if (savedCharacter && !character) {
      setCharacter(savedCharacter);
    }
  }, [savedCharacter]);

  const { mutateAsync: _updateCharacter } = useUpdateCharacterMutation(characterId);
  const updateCharacter = useMemo(
    () => debounce((character: Character) => _updateCharacter({ character }), 2000),
    []
  );

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (character && savedCharacter) {
      const saved = isEqual(character, savedCharacter);
      setSaved(saved);
      if (saved) {
        updateCharacter.cancel();
      } else {
        updateCharacter(character);
      }
    }
  }, [character, savedCharacter]);

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Characters']}
        title={character ? character.name || 'Unnamed Character' : ''}
        extra={
          <VFlex vertical align="end" gap={theme.variable.gap.md}>
            <SavedStatus saved={saved} />
            <VButton onClick={() => setDeleteCharacterModalOpen(true)} disabled={!saved}>
              <TrashCanIcon /> Delete character
            </VButton>
          </VFlex>
        }
      />

      <CharacterSheet character={character} setCharacter={setCharacter} />

      <DeleteCharacterModal
        open={deleteCharacterModalOpen}
        onClose={() => setDeleteCharacterModalOpen(false)}
        characterId={characterId}
      />

      <RollLog characterId={characterId} />
    </PageLayout>
  );
};
