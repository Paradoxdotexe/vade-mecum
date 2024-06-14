import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { useParams } from 'react-router-dom';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useSessionEncounterQuery } from '../../queries/useSessionEncounterQuery';
import { useVTTUser } from '@/common/VTTUser';
import { VFlex } from '@/components/VFlex';
import { SavedStatus } from '../../SavedStatus';
import { Encounter, isCharacterCombatant } from '../../types/Encounter';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { ReactComponent as PlayIcon } from '@/icons/Play.svg';
import { ReactComponent as ChevronLeftIcon } from '@/icons/ChevronLeft.svg';
import { ReactComponent as ChevronRightIcon } from '@/icons/ChevronRight.svg';
import { ReactComponent as MarkerIcon } from '@/icons/Marker.svg';
import { useVTheme } from '@/common/VTheme';
import { useUpdateSessionEncounterMutation } from '../../queries/useUpdateSessionEncounterMutation';
import { debounce, isEqual } from 'lodash-es';
import styled from 'styled-components';
import { DeleteSessionEncounterModal } from './DeleteSessionEncounterModal';
import { EncounterCombatantCard } from '@/pages/vtt/sessions/session/EncounterCombatantCard';
import { useSessionCharactersQuery } from '@/pages/vtt/queries/useSessionCharactersQuery';
import { VLoader } from '@/components/VLoader';

const StyledSessionEncounterPage = styled(PageLayout)`
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
`;

export const SessionEncounterPage: React.FC = () => {
  const { sessionId, encounterId } = useParams();
  const theme = useVTheme();
  const user = useVTTUser();

  const { data: session } = useSessionQuery(sessionId);

  const [deleteSessionEncounterModalOpen, setDeleteSessionEncounterModalOpen] = useState(false);

  const [encounter, setEncounter] = useState<Encounter>();
  const [saved, setSaved] = useState(true);

  const { data: sessionCharacters } = useSessionCharactersQuery(sessionId);

  const { data: savedEncounter } = useSessionEncounterQuery(sessionId, encounterId);
  useMemo(() => {
    if (savedEncounter && !encounter) {
      setEncounter(savedEncounter);
    }
  }, [savedEncounter]);

  const { mutateAsync: _updateSessionEncounter } = useUpdateSessionEncounterMutation(
    sessionId,
    encounterId
  );
  const updateSessionEncounter = useMemo(
    () => debounce((encounter: Encounter) => _updateSessionEncounter({ encounter }), 1000),
    []
  );

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (encounter && savedEncounter) {
      const saved = isEqual(encounter, savedEncounter);
      setSaved(saved);
      if (saved) {
        updateSessionEncounter.cancel();
      } else {
        updateSessionEncounter(encounter);
      }
    }
  }, [encounter, savedEncounter]);

  const canEditEncounter = user.authenticated && user.id === session?.userId;

  useEffect(() => {
    // ensure combatants is up to date with session characters and their latest initiative
    if (encounter && encounter.turn === 0 && sessionCharacters) {
      const combatants = encounter.combatants;

      for (const character of sessionCharacters) {
        const index = combatants.findIndex(
          combatant => isCharacterCombatant(combatant) && combatant.characterId === character.id
        );
        if (index === -1) {
          // add character to combatants
          combatants.push({
            characterId: character.id,
            initiative: 0
          });
        } else {
          // update character's initiative
          combatants[index].initiative = 0;
        }
      }
      setEncounter({
        ...encounter,
        combatants
      });
    }
  }, [savedEncounter, sessionCharacters]);

  return (
    <StyledSessionEncounterPage>
      <PageHeader
        breadcrumbs={[
          'Virtual Tabletop',
          'Sessions',
          session ? session.name || 'Unnamed Session' : '...',
          'Encounters'
        ]}
        title={
          encounter && (
            <input
              value={encounter.name}
              placeholder="Unnamed Encounter"
              onChange={event =>
                setEncounter(encounter => encounter && { ...encounter, name: event.target.value })
              }
              className="page__pageHeader__titleInput"
              disabled={!canEditEncounter}
            />
          )
        }
        extra={
          <>
            {canEditEncounter && (
              <VFlex vertical align="end" gap={theme.variable.gap.md}>
                <SavedStatus saved={saved} />
                <VButton onClick={() => setDeleteSessionEncounterModalOpen(true)} disabled={!saved}>
                  <TrashCanIcon /> Delete encounter
                </VButton>
              </VFlex>
            )}
          </>
        }
      />

      {!encounter || !sessionCharacters ? (
        <VLoader />
      ) : (
        <VFlex justify="center">
          <VFlex vertical gap={theme.variable.gap.xl} style={{ flexBasis: 464 }}>
            <VFlex
              justify="space-between"
              align="center"
              style={{
                borderBottom: `1px solid ${theme.color.border.default}`,
                paddingBottom: theme.variable.gap.lg
              }}
            >
              {encounter.turn === 0 ? (
                <VButton
                  type="primary"
                  onClick={() => setEncounter({ ...encounter, turn: 1 })}
                  style={{ margin: 'auto' }}
                >
                  <PlayIcon />
                  Start encounter
                </VButton>
              ) : (
                <>
                  <VButton onClick={() => setEncounter({ ...encounter, turn: encounter.turn - 1 })}>
                    <ChevronLeftIcon />
                    Back
                  </VButton>

                  <VFlex
                    align="center"
                    gap={theme.variable.gap.md}
                    style={{ fontSize: theme.variable.fontSize.lg }}
                  >
                    <strong>Round {Math.ceil(encounter.turn / 4)}</strong>
                    <div>/</div>
                    <div>Turn {1 + ((encounter.turn - 1) % 4)}</div>
                  </VFlex>

                  <VButton
                    type="primary"
                    onClick={() => setEncounter({ ...encounter, turn: encounter.turn + 1 })}
                  >
                    Next
                    <ChevronRightIcon />
                  </VButton>
                </>
              )}
            </VFlex>

            <VFlex vertical gap={theme.variable.gap.lg}>
              {encounter.combatants.map((combatant, i) => (
                <VFlex
                  align="center"
                  key={isCharacterCombatant(combatant) ? combatant.characterId : combatant.enemyKey}
                  style={{ position: 'relative' }}
                >
                  <MarkerIcon
                    fontSize={20}
                    style={{
                      position: 'absolute',
                      left: -parseInt(theme.variable.gap.xl),
                      display: i === (encounter.turn - 1) % 4 ? 'block' : 'none'
                    }}
                    color={theme.color.status.success.text}
                  />
                  <EncounterCombatantCard
                    sessionId={sessionId}
                    encounterCombatant={combatant}
                    style={{ flex: 1 }}
                  />
                </VFlex>
              ))}
            </VFlex>
          </VFlex>
        </VFlex>
      )}

      <DeleteSessionEncounterModal
        open={deleteSessionEncounterModalOpen}
        onClose={() => setDeleteSessionEncounterModalOpen(false)}
        sessionId={sessionId}
        encounterId={encounterId}
      />
    </StyledSessionEncounterPage>
  );
};
