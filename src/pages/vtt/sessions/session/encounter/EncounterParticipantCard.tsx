import React from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { useVTheme } from '@/common/VTheme';
import { VFlex } from '@/components/VFlex';
import { useCharacterClient } from '@/pages/vtt/characters/character/useCharacterClient';
import { NumberInputOverMax } from '@/pages/vtt/characters/character/cards/NumberInputOverMax';
import { VTag } from '@/components/VTag';
import classNames from 'classnames';
import {
  EncounterParticipant,
  isCharacterParticipant,
  isCombatantParticipant
} from '@/pages/vtt/types/Encounter';
import { useSessionCharacterQuery } from '@/pages/vtt/queries/useSessionCharacterQuery';
import { opacify } from 'polished';
import { useCombatantClient } from '@/pages/vtt/sessions/session/encounter/useCombatantClient';
import { WORLD_KIT } from '@/pages/vtt/types/WorldKit';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { useVTTUser } from '@/common/VTTUser';

const StyledEncounterParticipantCard = styled(VCard)`
  max-width: 400px;

  &.card--bloodied {
    border-color: ${props => props.theme.color.status.error.border};
    background-color: ${props => props.theme.color.status.error.background};

    &:hover {
      background-color: ${props => opacify(0.1, props.theme.color.status.error.background)};
    }

    input,
    .card__stat {
      background-color: ${props => props.theme.color.status.error.background};
    }
  }

  &.card--incapacitated {
    opacity: 0.6;
  }
`;

type EncounterParticipantCardProps = {
  sessionId: string | undefined;
  participant: EncounterParticipant;
  onClick?: () => void;
  onChangeHealthPoints?: (healthPoints: number) => void;
  style?: React.CSSProperties;
};

export const EncounterParticipantCard: React.FC<EncounterParticipantCardProps> = props => {
  const theme = useVTheme();
  const user = useVTTUser();

  const { data: session } = useSessionQuery(props.sessionId);

  const participant = props.participant;

  const { data: character } = useSessionCharacterQuery(
    props.sessionId,
    isCharacterParticipant(participant) ? participant.characterId : undefined
  );
  const combatant = isCombatantParticipant(participant)
    ? WORLD_KIT.combatants.find(combatant => combatant.key === participant.combatantKey)
    : undefined;

  const characterClient = useCharacterClient(character);
  const combatantClient = combatant && useCombatantClient(combatant);

  const name = characterClient?.name ?? combatantClient?.name;
  const speed = characterClient?.speed ?? combatantClient?.speed ?? 0;
  const healthPoints = isCombatantParticipant(participant)
    ? participant.healthPoints
    : characterClient?.healthPoints ?? 0;
  const maxHealthPoints = characterClient?.maxHealthPoints ?? combatantClient?.maxHealthPoints ?? 0;

  const incapacitated = healthPoints === 0;
  const bloodied = !incapacitated && healthPoints <= maxHealthPoints / 2;

  const className = classNames({
    'card--bloodied': bloodied,
    'card--incapacitated': incapacitated
  });

  const canEditEncounter = user.authenticated && user.id === session?.userId;

  return (
    <StyledEncounterParticipantCard
      onClick={props.onClick}
      className={className}
      style={props.style}
    >
      <VFlex justify="space-between" align="center">
        <VFlex vertical gap={theme.variable.gap.md}>
          <div style={{ fontWeight: 600 }}>{name || 'Unnamed Character'}</div>
          <VFlex gap={theme.variable.gap.md}>
            <VTag className="card__stat">
              <strong>INIT</strong> {participant.initiative || '—'}
            </VTag>
            <VTag className="card__stat">
              <strong>SPEED</strong> {speed * 5}ft
            </VTag>
          </VFlex>
        </VFlex>

        <NumberInputOverMax
          size={44}
          value={healthPoints}
          onChange={props.onChangeHealthPoints}
          max={maxHealthPoints}
          disabled={!canEditEncounter || isCharacterParticipant(participant)}
        />
      </VFlex>
    </StyledEncounterParticipantCard>
  );
};
