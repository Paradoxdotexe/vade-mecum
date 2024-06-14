import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useSessionEncounterQuery } from '../../queries/useSessionEncounterQuery';
import { useVTTUser } from '@/common/VTTUser';
import { VFlex } from '@/components/VFlex';
import { SavedStatus } from '../../SavedStatus';
import { Encounter, isCharacterCombatant, isEnemyCombatant } from '../../types/Encounter';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { ReactComponent as PlayIcon } from '@/icons/Play.svg';
import { ReactComponent as ChevronLeftIcon } from '@/icons/ChevronLeft.svg';
import { ReactComponent as ChevronRightIcon } from '@/icons/ChevronRight.svg';
import { ReactComponent as MarkerIcon } from '@/icons/Marker.svg';
import { useVTheme } from '@/common/VTheme';
import { useUpdateSessionEncounterMutation } from '../../queries/useUpdateSessionEncounterMutation';
import { debounce, isEqual, sum } from 'lodash-es';
import styled from 'styled-components';
import { DeleteSessionEncounterModal } from './DeleteSessionEncounterModal';
import { EncounterCombatantCard } from '@/pages/vtt/sessions/session/EncounterCombatantCard';
import { useSessionCharactersQuery } from '@/pages/vtt/queries/useSessionCharactersQuery';
import { VLoader } from '@/components/VLoader';
import { useRolls } from '@/pages/vtt/rolls/useRolls';
import { RollLog } from '@/pages/vtt/rolls/RollLog';
import { RollEvaluation } from '@/pages/vtt/types/Roll';

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
  const navigate = useNavigate();
  const theme = useVTheme();
  const user = useVTTUser();
  const { rolls } = useRolls(sessionId);

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
    if (encounter && sessionCharacters && rolls && canEditEncounter) {
      // remove combatants for removed session characters
      const combatants = [...encounter.combatants].filter(
        combatant =>
          isEnemyCombatant(combatant) ||
          sessionCharacters.some(character => character.id === combatant.characterId)
      );

      // only add characters and update initiative before encounter has started
      if (encounter.turn === 0) {
        for (const character of sessionCharacters) {
          const initiativeRoll = rolls.find(
            roll =>
              roll.characterId === character.id &&
              roll.evaluation === RollEvaluation.SUM &&
              roll.label === 'Initiative'
          );
          const initiative = initiativeRoll ? sum(initiativeRoll.dice) : 0;

          const index = combatants.findIndex(
            combatant => isCharacterCombatant(combatant) && combatant.characterId === character.id
          );
          if (index === -1) {
            // add character to combatants
            combatants.push({
              characterId: character.id,
              initiative
            });
          } else {
            // update character's initiative
            combatants[index].initiative = initiative;
          }
        }
      }

      setEncounter({
        ...encounter,
        combatants
      });
    }
  }, [encounter?.turn, sessionCharacters, rolls, canEditEncounter]);

  const initiativeMissing =
    encounter &&
    encounter.combatants.some(
      combatant => isCharacterCombatant(combatant) && !combatant.initiative
    );

  const round = encounter ? Math.ceil(encounter.turn / encounter.combatants.length) : 0;
  const turn = encounter ? 1 + ((encounter.turn - 1) % encounter.combatants.length) : 0;

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

      {!encounter || !sessionCharacters || !rolls ? (
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
                initiativeMissing ? (
                  <VFlex
                    align="center"
                    style={{
                      margin: 'auto',
                      color: theme.color.text.secondary,
                      height: 34
                    }}
                  >
                    Waiting for characters to roll for initiative...
                  </VFlex>
                ) : (
                  <VButton
                    type="primary"
                    onClick={() => setEncounter({ ...encounter, turn: 1 })}
                    style={{ margin: 'auto' }}
                    disabled={!canEditEncounter}
                  >
                    <PlayIcon />
                    Start encounter
                  </VButton>
                )
              ) : (
                <>
                  <VButton
                    onClick={() => setEncounter({ ...encounter, turn: encounter.turn - 1 })}
                    disabled={!canEditEncounter}
                  >
                    <ChevronLeftIcon />
                    Back
                  </VButton>

                  <VFlex
                    align="center"
                    gap={theme.variable.gap.md}
                    style={{ fontSize: theme.variable.fontSize.lg }}
                  >
                    <strong>Round {round}</strong>
                    <div>/</div>
                    <div>Turn {turn}</div>
                  </VFlex>

                  <VButton
                    type="primary"
                    onClick={() => setEncounter({ ...encounter, turn: encounter.turn + 1 })}
                    disabled={!canEditEncounter}
                  >
                    Next
                    <ChevronRightIcon />
                  </VButton>
                </>
              )}
            </VFlex>

            <VFlex vertical gap={theme.variable.gap.lg}>
              {[...encounter.combatants]
                .sort((a, b) => b.initiative - a.initiative)
                .map((combatant, i) => (
                  <VFlex
                    align="center"
                    key={
                      isCharacterCombatant(combatant) ? combatant.characterId : combatant.enemyKey
                    }
                    style={{ position: 'relative' }}
                  >
                    <MarkerIcon
                      fontSize={20}
                      style={{
                        position: 'absolute',
                        left: -parseInt(theme.variable.gap.xl),
                        display: i === turn - 1 ? 'block' : 'none'
                      }}
                      color={theme.color.status.success.text}
                    />
                    <EncounterCombatantCard
                      sessionId={sessionId}
                      encounterCombatant={combatant}
                      style={{ flex: 1 }}
                      onClick={() => {
                        if (isCharacterCombatant(combatant)) {
                          const character = sessionCharacters.find(
                            character => character.id === combatant.characterId
                          );
                          if (character) {
                            if (user.authenticated && user.id === character.userId) {
                              navigate(`/vtt/characters/${character.id}`);
                            } else {
                              navigate(`/vtt/sessions/${sessionId}/characters/${character.id}`);
                            }
                          }
                        }
                      }}
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

      <RollLog sessionId={sessionId} />
    </StyledSessionEncounterPage>
  );
};
