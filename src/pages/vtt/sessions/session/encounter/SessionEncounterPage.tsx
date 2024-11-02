import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useSessionEncounterQuery } from '../../../queries/useSessionEncounterQuery';
import { useVTTUser } from '@/common/VTTUser';
import { VFlex } from '@/components/VFlex';
import { SavedStatus } from '../../../SavedStatus';
import {
  CombatantParticipant,
  Encounter,
  isCharacterParticipant,
  isCombatantParticipant
} from '../../../types/Encounter';
import { VButton } from '@/components/VButton';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { ReactComponent as PlayIcon } from '@/icons/Play.svg';
import { ReactComponent as ChevronLeftIcon } from '@/icons/ChevronLeft.svg';
import { ReactComponent as ChevronRightIcon } from '@/icons/ChevronRight.svg';
import { ReactComponent as MarkerIcon } from '@/icons/Marker.svg';
import { useVTheme } from '@/common/VTheme';
import { useUpdateSessionEncounterMutation } from '../../../queries/useUpdateSessionEncounterMutation';
import { debounce, isEqual, sum } from 'lodash-es';
import styled from 'styled-components';
import { DeleteSessionEncounterModal } from './DeleteSessionEncounterModal';
import { EncounterParticipantCard } from './EncounterParticipantCard';
import { useSessionCharactersQuery } from '@/pages/vtt/queries/useSessionCharactersQuery';
import { VLoader } from '@/components/VLoader';
import { useRolls } from '@/pages/vtt/rolls/useRolls';
import { RollLog } from '@/pages/vtt/rolls/RollLog';
import { RollEvaluation } from '@/pages/vtt/types/Roll';
import { useSessionConnection } from '@/pages/vtt/sessions/useSessionConnection';
import { CombatantsDrawer } from '@/pages/vtt/sessions/session/encounter/CombatantsDrawer';
import { getCombatantMaxHealthPoints } from '@/pages/vtt/sessions/session/encounter/useCombatantClient';
import { WORLD_KIT } from '@/pages/vtt/types/WorldKit';
import { CombatantDrawer } from '@/pages/vtt/sessions/session/encounter/CombatantDrawer';
import { rollDie } from '@/utils/rollDie';
import { VHelmetTitle } from '@/components/VHelmetTitle';

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
  useSessionConnection(sessionId);

  const navigate = useNavigate();
  const theme = useVTheme();
  const user = useVTTUser();
  const { rolls } = useRolls();

  const { data: session } = useSessionQuery(sessionId);

  const canEditEncounter = user.authenticated && user.id === session?.userId;

  const [deleteSessionEncounterModalOpen, setDeleteSessionEncounterModalOpen] = useState(false);
  const [combatantsDrawerOpen, setCombatantsDrawerOpen] = useState(false);
  const [selectedCombatantParticipant, setSelectedCombatantParticipant] =
    useState<CombatantParticipant>();

  const [encounter, setEncounter] = useState<Encounter>();
  const [saved, setSaved] = useState(true);

  const { data: sessionCharacters } = useSessionCharactersQuery(sessionId);

  const { data: savedEncounter } = useSessionEncounterQuery(sessionId, encounterId);
  useMemo(() => {
    if (savedEncounter) {
      setEncounter(structuredClone(savedEncounter));
    }
  }, [savedEncounter]);

  const { mutateAsync: _updateSessionEncounter } = useUpdateSessionEncounterMutation(
    sessionId,
    encounterId
  );
  const updateSessionEncounter = useMemo(
    () => debounce((encounter: Encounter) => _updateSessionEncounter({ encounter }), 2000),
    []
  );

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (encounter && savedEncounter && canEditEncounter) {
      const saved = isEqual(encounter, savedEncounter);
      setSaved(saved);
      if (saved) {
        updateSessionEncounter.cancel();
      } else {
        updateSessionEncounter(encounter);
      }
    }
  }, [encounter, savedEncounter]);

  useEffect(() => {
    // ensure participants is up to date with session characters and their latest initiative
    if (encounter && sessionCharacters && rolls && canEditEncounter) {
      // remove participants for removed session characters
      const participants = [...encounter.participants].filter(
        participant =>
          isCombatantParticipant(participant) ||
          sessionCharacters.some(character => character.id === participant.characterId)
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

          const index = participants.findIndex(
            participant =>
              isCharacterParticipant(participant) && participant.characterId === character.id
          );
          if (index === -1) {
            // add character to participants
            participants.push({
              characterId: character.id,
              initiative
            });
          } else {
            // update character's initiative
            participants[index].initiative = initiative;
          }
        }
      }

      setEncounter({
        ...encounter,
        participants
      });
    }
  }, [encounter?.turn, sessionCharacters, rolls, canEditEncounter]);

  const onStartEncounter = () => {
    if (encounter) {
      const participants = structuredClone(encounter.participants);

      // roll initiative for combatants
      for (const participant of participants) {
        if (isCombatantParticipant(participant)) {
          const combatant = WORLD_KIT.combatants.find(
            combatant => combatant.key === participant.combatantKey
          );
          if (combatant) {
            const diceCount = combatant.attributes.dexterity + combatant.attributes.perception;
            const initiative = sum([...new Array(diceCount)].map(() => rollDie()));

            participant.initiative = initiative;
          }
        }
      }

      participants.sort((a, b) => b.initiative - a.initiative);

      setEncounter({ ...encounter, participants, turn: 1 });
    }
  };

  const initiativeMissing =
    encounter &&
    encounter.participants.some(
      participant => isCharacterParticipant(participant) && !participant.initiative
    );

  const round = encounter ? Math.ceil(encounter.turn / encounter.participants.length) : 0;
  const turn = encounter ? 1 + ((encounter.turn - 1) % encounter.participants.length) : 0;

  const selectedCombatant =
    selectedCombatantParticipant &&
    WORLD_KIT.combatants.find(
      combatant => combatant.key === selectedCombatantParticipant.combatantKey
    );

  return (
    <StyledSessionEncounterPage>
      <PageHeader
        breadcrumbs={[
          'Virtual Tabletop',
          { label: 'Sessions', path: '/vtt/sessions' },
          {
            label: session ? session.name || 'Unnamed Session' : '...',
            path: `/vtt/sessions/${sessionId}`
          },
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
                <VFlex gap={theme.variable.gap.md}>
                  <VButton onClick={() => setCombatantsDrawerOpen(true)}>
                    <PlusIcon />
                    Add combatant
                  </VButton>
                  <VButton
                    onClick={() => setDeleteSessionEncounterModalOpen(true)}
                    disabled={!saved}
                  >
                    <TrashCanIcon />
                  </VButton>
                </VFlex>
              </VFlex>
            )}
          </>
        }
      />
      <VHelmetTitle>
        VTT | {session ? session.name || 'Unnamed Session' : '—'} |{' '}
        {encounter ? encounter.name || 'Unnamed Encounter' : '—'}
      </VHelmetTitle>

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
                    Waiting for all characters to roll for initiative...
                  </VFlex>
                ) : (
                  <VButton
                    type="primary"
                    onClick={onStartEncounter}
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
              {[...encounter.participants].map((participant, i) => (
                <VFlex
                  align="center"
                  key={`${
                    isCharacterParticipant(participant)
                      ? participant.characterId
                      : participant.combatantKey
                  }#${i}`}
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
                  <EncounterParticipantCard
                    sessionId={sessionId}
                    participant={participant}
                    style={{
                      flex: 1,
                      marginLeft: isCombatantParticipant(participant) ? theme.variable.gap.xxl : 0
                    }}
                    onClick={() => {
                      if (isCharacterParticipant(participant)) {
                        const character = sessionCharacters.find(
                          character => character.id === participant.characterId
                        );
                        if (character) {
                          if (user.authenticated && user.id === character.userId) {
                            navigate(`/vtt/characters/${character.id}`);
                          } else {
                            navigate(`/vtt/sessions/${sessionId}/characters/${character.id}`);
                          }
                        }
                      } else {
                        setSelectedCombatantParticipant(participant);
                      }
                    }}
                    onChangeHealthPoints={healthPoints => {
                      const participants = structuredClone(encounter.participants);
                      (participants[i] as CombatantParticipant).healthPoints = healthPoints;
                      setEncounter({ ...encounter, participants });
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

      {encounter && (
        <CombatantsDrawer
          open={combatantsDrawerOpen}
          onClose={() => setCombatantsDrawerOpen(false)}
          onAddCombatant={combatant => {
            setEncounter({
              ...encounter,
              participants: [
                ...encounter.participants,
                {
                  combatantKey: combatant.key,
                  healthPoints: getCombatantMaxHealthPoints(combatant),
                  initiative: 0
                }
              ]
            });
          }}
        />
      )}

      {selectedCombatant && (
        <CombatantDrawer
          combatant={selectedCombatant}
          healthPoints={selectedCombatantParticipant.healthPoints}
          open
          onClose={() => setSelectedCombatantParticipant(undefined)}
        />
      )}

      <RollLog />
    </StyledSessionEncounterPage>
  );
};
