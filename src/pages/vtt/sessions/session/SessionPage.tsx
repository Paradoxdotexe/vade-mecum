import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import styled from 'styled-components';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useNavigate, useParams } from 'react-router-dom';
import { useVTTUser } from '@/common/VTTUser';
import { Session } from '../../types/Session';
import { debounce } from 'lodash-es';
import { useUpdateSessionMutation } from '../../queries/useUpdateSessionMutation';
import { SavedStatus } from '../../SavedStatus';
import { AddSessionCharacterModal } from './AddSessionCharacterModal';
import { DeleteSessionModal } from './DeleteSessionModal';
import { VHeader } from '@/components/VHeader';
import { useSessionCharactersQuery } from '../../queries/useSessionCharactersQuery';
import { CharacterCard } from '../../characters/CharacterCard';
import { VLoader } from '@/components/VLoader';
import { useRemoveSessionCharacter } from '../../queries/useRemoveSessionCharacter';
import { Character } from '../../types/Character';
import { RollLog } from '../../rolls/RollLog';
import { useCreateSessionEncounterMutation } from '../../queries/useCreateSessionEncounterMutation';

const StyledSessionPage = styled(PageLayout)`
  .page__pageHeader__titleInput {
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    height: 100%;

    &::placeholder {
      color: ${props => props.theme.color.text.tertiary};
    }
  }

  .page__section {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};

    .section__empty {
      color: ${props => props.theme.color.text.secondary};
    }
  }

  .section__characters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${props => props.theme.variable.gap.lg};

    .characters__character {
      position: relative;

      .character__delete {
        position: absolute;
        top: -11px;
        right: -11px;

        button {
          background-color: ${props => props.theme.color.background.raised};
        }
      }
    }
  }
`;

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const theme = useVTheme();
  const user = useVTTUser();

  const [session, setSession] = useState<Session>();
  const [saved, setSaved] = useState(true);

  const [deleteSessionModalOpen, setDeleteSessionModalOpen] = useState(false);
  const [addSessionCharacterModalOpen, setAddSessionCharacterModalOpen] = useState(false);

  const { data: savedSession } = useSessionQuery(sessionId);
  useMemo(() => {
    if (savedSession && !session) {
      setSession(savedSession);
    }
  }, [savedSession]);

  const { data: characters } = useSessionCharactersQuery(sessionId);

  const { mutateAsync: _updateSession } = useUpdateSessionMutation(sessionId);
  const updateSession = useMemo(
    () => debounce((session: Session) => _updateSession({ session }), 2000),
    []
  );

  const createSessionEncounterMutation = useCreateSessionEncounterMutation(sessionId);

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (session && savedSession) {
      const saved = session.name === savedSession.name;
      setSaved(saved);
      if (saved) {
        updateSession.cancel();
      } else {
        updateSession(session);
      }
    }
  }, [session, savedSession]);

  const [removedCharacterId, setRemovedCharacterId] = useState<string>();

  const removeSessionCharacter = useRemoveSessionCharacter(sessionId, removedCharacterId);

  useEffect(() => {
    if (removedCharacterId) {
      removeSessionCharacter.mutateAsync().then(() => setRemovedCharacterId(undefined));
    }
  }, [removedCharacterId]);

  const canEditSession = user.authenticated && user.id === session?.userId;

  const canEditCharacter = (character: Character) =>
    user.authenticated && user.id === character.userId;

  const onAddEncounter = () => {
    createSessionEncounterMutation.mutateAsync().then(() => {});
  };

  return (
    <StyledSessionPage>
      <PageHeader
        breadcrumbs={['Virtual Tabletop', 'Sessions']}
        title={
          session && (
            <input
              value={session.name}
              placeholder="Unnamed Session"
              onChange={event =>
                setSession(session => session && { ...session, name: event.target.value })
              }
              className="page__pageHeader__titleInput"
              disabled={!canEditSession}
            />
          )
        }
        extra={
          <>
            <VButton onClick={() => setAddSessionCharacterModalOpen(true)}>
              <PlusIcon />
              Add character
            </VButton>

            {canEditSession && (
              <VButton onClick={onAddEncounter} loading={createSessionEncounterMutation.isLoading}>
                <PlusIcon /> Add encounter
              </VButton>
            )}

            {canEditSession && (
              <VFlex vertical align="end" gap={theme.variable.gap.md}>
                <SavedStatus saved={saved} />
                <VButton onClick={() => setDeleteSessionModalOpen(true)} disabled={!saved}>
                  <TrashCanIcon /> Delete session
                </VButton>
              </VFlex>
            )}
          </>
        }
      />

      <VFlex vertical gap={theme.variable.gap.xl}>
        {!characters ? (
          <VLoader />
        ) : (
          <div className="page__section">
            <VHeader>Characters</VHeader>

            {characters.length ? (
              <div className="section__characters">
                {characters.map(character => (
                  <div key={character.id} className="characters__character">
                    <CharacterCard
                      character={character}
                      onClick={() => {
                        if (user.authenticated && user.id === character.userId) {
                          navigate(`/vtt/characters/${character.id}`);
                        } else {
                          navigate(`/vtt/sessions/${sessionId}/characters/${character.id}`);
                        }
                      }}
                      loading={
                        removeSessionCharacter.isLoading && character.id === removedCharacterId
                      }
                    />
                    {(canEditSession || canEditCharacter(character)) && (
                      <div className="character__delete">
                        <VButton
                          size="small"
                          onClick={() => setRemovedCharacterId(character.id)}
                          disabled={
                            removeSessionCharacter.isLoading && character.id === removedCharacterId
                          }
                        >
                          <TrashCanIcon />
                        </VButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="section__empty">Add a character to the session to get started.</div>
            )}
          </div>
        )}
      </VFlex>

      <DeleteSessionModal
        open={deleteSessionModalOpen}
        onClose={() => setDeleteSessionModalOpen(false)}
        sessionId={sessionId}
      />

      <AddSessionCharacterModal
        open={addSessionCharacterModalOpen}
        onClose={() => setAddSessionCharacterModalOpen(false)}
        sessionId={sessionId}
      />

      <RollLog sessionId={sessionId} />
    </StyledSessionPage>
  );
};
