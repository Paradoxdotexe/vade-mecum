import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { VModal, VModalProps } from '@/components/VModal';
import React from 'react';
import { CharacterCard } from '@/pages/vtt/characters/CharacterCard';
import { useGetCharactersQuery } from '@/pages/vtt/queries/useGetCharactersQuery';
import { VLoader } from '@/components/VLoader';
import { useGetSessionQuery } from '@/pages/vtt/queries/useGetSessionQuery';

type AddCharacterModalProps = Pick<VModalProps, 'open' | 'onClose'> & {
  sessionId: string | undefined;
};

export const AddCharacterModal: React.FC<AddCharacterModalProps> = props => {
  const theme = useVTheme();

  const { data: session } = useGetSessionQuery(props.sessionId);
  const { data: characters } = useGetCharactersQuery({ enabled: props.open });

  return (
    <VModal
      open={props.open}
      onClose={props.onClose}
      header="Add Character"
      width={320}
      //closable={!deleteSession.isLoading}
    >
      <VFlex vertical gap={theme.variable.gap.lg} style={{ padding: theme.variable.gap.lg }}>
        {characters ? (
          characters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              disabled={session?.characterIds.includes(character.id)}
            />
          ))
        ) : (
          <VLoader />
        )}
      </VFlex>
    </VModal>
  );
};
