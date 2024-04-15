import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { RollCard } from './RollCard';
import { ReactComponent as PlusIcon } from '@/icons/Plus.svg';
import { ReactComponent as TrashCanIcon } from '@/icons/TrashCan.svg';
import { CharacterSheet } from './characterSheet/CharacterSheet';
import { useCharacters } from './useCharacters';
import { useRolls } from './useRolls';
import { VButton } from '@/components/VButton';
import { SessionsDrawer } from './SessionsDrawer';
import { useSession } from './useSession';
import { VLoader } from '@/components/VLoader';
import { VTransition } from '@/components/VTransition';
import { keyBy } from 'lodash-es';
import { pulsingSuccess } from '@/styles/pulsingBackground';

const Page = styled.div`
  display: flex;
  justify-content: center;

  .page__content {
    padding: 48px;
    margin-right: 248px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
    width: 1200px;

    .content__tabs {
      display: flex;
      align-items: flex-end;
      height: 41px;
      gap: 6px;
      border-bottom: 1px solid #585858;

      .tabs__tab {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #3b3b3b;
        border-radius: 6px 6px 0 0;
        padding: 12px;
        cursor: pointer;
        transition: all 150ms ease;
        border-top: 1px solid #585858;
        border-left: 1px solid #585858;
        border-right: 1px solid #585858;
        box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);
        position: relative;

        &:not(.tab--active) {
          opacity: 0.8;
          font-size: 14px;
          padding: 9px;

          &:hover {
            opacity: 1;
          }

          .tab__activity {
            width: 4px;
            height: 4px;
            right: 5px;
            top: 5px;
          }
        }

        svg {
          font-size: 12px;
        }

        .tab__delete {
          font-size: 18px;
          color: #a0a0a0;
          transition: color 150ms ease;

          &:hover {
            color: #fff;
          }
        }

        .tab__activity {
          background-color: #585858;
          width: 6px;
          height: 6px;
          border-radius: 6px;
          position: absolute;
          right: 6px;
          top: 6px;

          &.activity--online {
            background-color: ${pulsingSuccess};
          }
        }
      }
    }

    .content__rollLog {
      position: fixed;
      top: 0;
      right: 0;
      border-left: 1px solid #585858;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: -3px 6px 12px rgba(0, 0, 0, 0.1);
      background: #2c2c2c;
      z-index: 100;

      .rollLog__header {
        display: flex;
        justify-content: center;
        font-family: 'Noto Sans Display', sans-serif;
        font-size: 24px;
        padding: 18px;
        border-bottom: 1px solid #585858;
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
          height: 80px;
          background-image: linear-gradient(#2c2c2c 0%, transparent 100%);
          z-index: 1;
        }

        .log__rolls {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          gap: 24px;
          padding: 24px 6px;
          border-bottom: 1px solid #585858;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-gutter: stable both-edges;
          min-width: 282px;

          > div {
            flex-shrink: 0;
          }
        }

        .log__session {
          padding: 18px;
          width: 100%;
          min-height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;

          .session__name {
            font-size: 14px;

            span {
              font-weight: 600;
            }
          }
        }
      }
    }
  }
`;

export const EnginePage: React.FC = () => {
  const { rolls } = useRolls();
  const { characters, currentCharacter, setCurrentCharacter, addCharacter, removeCharacter } =
    useCharacters();
  const { session, sessionId, userId } = useSession();

  const sessionUsersById = keyBy(session?.users, 'id');

  const [viewingSessions, setViewingSessions] = useState(false);

  return (
    <Page>
      <div className="page__content">
        <div className="content__tabs">
          {Object.values(characters).map(character => {
            const active = character.id === currentCharacter?.id;
            return (
              <div
                key={character.id}
                className={`tabs__tab ${active ? 'tab--active' : ''}`}
                onClick={() => setCurrentCharacter(character.id)}
              >
                {character.name || 'Anonymous'}
                {active && character.userId === userId && (
                  <TrashCanIcon
                    className="tab__delete"
                    onClick={event => {
                      event.stopPropagation();
                      removeCharacter(character.id);
                    }}
                  />
                )}
                {character.userId !== userId && (
                  <div
                    className={`tab__activity ${sessionUsersById[character.userId]?.online ? 'activity--online' : ''}`}
                  />
                )}
              </div>
            );
          })}
          <div className="tabs__tab" onClick={() => addCharacter()}>
            <PlusIcon />
          </div>
        </div>

        <div style={{ pointerEvents: currentCharacter?.userId !== userId ? 'none' : 'all' }}>
          <CharacterSheet />
        </div>

        <div className="content__rollLog">
          <div className="rollLog__header">Roll Log</div>
          <div className="rollLog__log">
            <div className="log__rolls">
              {rolls.map(roll => (
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
                  initialTransition
                  timeout={300}
                >
                  <RollCard
                    title={`${characters[roll.characterId]?.name || 'Anonymous'} (${roll.label})`}
                    dice={roll.dice}
                    evaluation={roll.evaluation}
                    minimized
                  />
                </VTransition>
              ))}
              {sessionId && !rolls && <VLoader style={{ padding: 0 }} />}
            </div>
            <div className="log__session">
              {sessionId && !session && <VLoader style={{ padding: 0 }} />}
              {session && (
                <div className="session__name">
                  <span>{session.name}</span> (#{session.id.split('-')[2]})
                </div>
              )}
              {!sessionId && (
                <VButton size="large" onClick={() => setViewingSessions(true)}>
                  Join Game Session
                </VButton>
              )}
              <SessionsDrawer open={viewingSessions} onClose={() => setViewingSessions(false)} />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
