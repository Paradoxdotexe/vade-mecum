import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/common/PageHeader';
import { PageLayout } from '@/common/PageLayout';
import { useParams } from 'react-router-dom';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useSessionEncounterQuery } from '../../queries/useSessionEncounterQuery';
import { useVTTUser } from '@/common/VTTUser';
import { VFlex } from '@/components/VFlex';
import { SavedStatus } from '../../SavedStatus';
import { Encounter } from '../../types/Encounter';
import { VButton } from '@/components/VButton';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { useVTheme } from '@/common/VTheme';
import { useUpdateSessionEncounterMutation } from '../../queries/useUpdateSessionEncounterMutation';
import { debounce } from 'lodash-es';
import styled from 'styled-components';
import { DeleteSessionEncounterModal } from './DeleteSessionEncounterModal';

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
    () => debounce((encounter: Encounter) => _updateSessionEncounter({ encounter }), 2000),
    []
  );

  // updated saved state and debounce save query when needed
  useEffect(() => {
    if (encounter && savedEncounter) {
      const saved = encounter.name === savedEncounter.name;
      setSaved(saved);
      if (saved) {
        updateSessionEncounter.cancel();
      } else {
        updateSessionEncounter(encounter);
      }
    }
  }, [encounter, savedEncounter]);

  const canEditEncounter = user.authenticated && user.id === session?.userId;

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

      <DeleteSessionEncounterModal
        open={deleteSessionEncounterModalOpen}
        sessionId={sessionId}
        encounterId={encounterId}
      />
    </StyledSessionEncounterPage>
  );
};
