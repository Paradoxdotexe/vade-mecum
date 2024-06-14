import { VTransition } from '@/components/VTransition';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { RollCard } from './RollCard';
import { useRolls } from './useRolls';
import { VLoader } from '@/components/VLoader';
import { useSessionQuery } from '@/pages/vtt/queries/useSessionQuery';
import { playSound } from '@/utils/playSound';

export const ROLL_LOG_WIDTH = '252px';

const StyledRollLog = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  border-left: 1px solid ${props => props.theme.color.border.default};
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: -4px 0 16px ${props => props.theme.color.shadow.default};
  background: ${props => props.theme.color.background.default};
  z-index: 100;
  width: ${ROLL_LOG_WIDTH};

  .rollLog__header {
    display: flex;
    justify-content: center;
    font-family: ${props => props.theme.variable.fontFamily.display};
    font-size: ${props => props.theme.variable.fontSize.xl};
    padding: ${props => props.theme.variable.gap.lg};
    border-bottom: 1px solid ${props => props.theme.color.border.default};
  }

  .rollLog__log {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
    position: relative;
    flex: 1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 64px;
      background-image: linear-gradient(
        ${props => props.theme.color.background.default} 0%,
        transparent 100%
      );
      z-index: 1;
    }

    .log__rolls {
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: ${props => props.theme.variable.gap.lg};
      padding: ${props => props.theme.variable.gap.lg} 0;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-gutter: stable both-edges;

      > div {
        flex-shrink: 0;
      }
    }

    .log__session {
      width: 100%;
      padding: ${props => props.theme.variable.gap.lg} ${props => props.theme.variable.gap.md};
      border-top: 1px solid ${props => props.theme.color.border.default};
      display: flex;
      justify-content: center;
      gap: ${props => props.theme.variable.gap.sm};

      .session__name {
        font-weight: 600;
        font-size: ${props => props.theme.variable.fontSize.sm};
      }

      .session__id {
        color: ${props => props.theme.color.text.secondary};
        font-size: ${props => props.theme.variable.fontSize.xs};
      }
    }
  }
`;

export const RollLog: React.FC = () => {
  const { rolls, sessionId } = useRolls();
  const [firstRender, setFirstRender] = useState(true);
  const [firstRollsRender, setFirstRollsRender] = useState(true);

  const { data: session } = useSessionQuery(sessionId);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  // wait past first render to confirm page has set sessionId via useSessionConnection
  const loading = firstRender || !rolls || (sessionId && !session);

  useEffect(() => {
    if (!loading && rolls) {
      setFirstRollsRender(false);
    }
  }, [loading, rolls]);

  // we play sound here to prevent playing it when a RollLog is not shown
  useEffect(() => {
    if (!firstRollsRender) {
      playSound('/sounds/DiceRoll.mp3');
    }
  }, [rolls]);

  return (
    <StyledRollLog id="roll-log">
      <div className="rollLog__header">Roll Log</div>
      <div className="rollLog__log">
        <div className="log__rolls">
          {rolls && !loading ? (
            rolls.map(roll => (
              <VTransition
                key={roll.id}
                in
                outStyle={css`
                  opacity: 0;
                  transform: translateY(200px);
                `}
                inStyle={css`
                  opacity: 1;
                  transform: translateY(0);
                `}
                initialTransition={!firstRollsRender}
                timeout={300}
              >
                <RollCard roll={roll} />
              </VTransition>
            ))
          ) : (
            <VLoader style={{ padding: 0 }} />
          )}
        </div>
        {session && !loading && (
          <div className="log__session">
            <div className="session__name">{session.name}</div>
            <div className="session__id">(#{session.id.split('-')[0]})</div>
          </div>
        )}
      </div>
    </StyledRollLog>
  );
};
