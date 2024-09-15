import React, { useState } from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { Roll, RollEvaluation } from '../types/Roll';
import { sum } from 'lodash-es';
import { VNumberInput } from '@/components/VNumberInput';
import { VCollapsible } from '@/components/VCollapsible';
import { ReactComponent as D20Icon } from '@/icons/D20.svg';
import classNames from 'classnames';
import { pulsingBackground } from '@/styles/pulsingBackground';

const StyledRollCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  width: 220px;
  overflow: hidden;
  padding: 0;
  border: none;

  &.card--character {
    .card__header {
      background: ${props => props.theme.color.status.success.border};
    }

    &.card--fate {
      background-color: ${props => props.theme.color.status.success.background};

      input {
        background-color: ${props => props.theme.color.status.success.background};
      }

      .card__header {
        ${props => pulsingBackground(props.theme.color.status.success.border)};
      }

      .dice__die {
        svg {
          color: ${props => props.theme.color.status.success.border} !important;
        }
      }
    }
  }

  &.card--combatant {
    .card__header {
      background: ${props => props.theme.color.status.failure.border};
    }

    &.card--fate {
      background-color: ${props => props.theme.color.status.failure.background};

      input {
        background-color: ${props => props.theme.color.status.failure.background};
      }

      .card__header {
        ${props => pulsingBackground(props.theme.color.status.failure.border)};
      }

      .dice__die {
        svg {
          color: ${props => props.theme.color.status.failure.border} !important;
        }
      }
    }
  }

  &.card--fury {
    .dice__die {
      svg {
        color: ${props => props.theme.color.background.default} !important;
      }
    }
  }

  .card__header {
    font-size: ${props => props.theme.variable.fontSize.xxs};
    padding: ${props => props.theme.variable.gap.sm} ${props => props.theme.variable.gap.md};
    background: ${props => props.theme.color.background.sunken};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .card__body {
    padding: ${props => props.theme.variable.gap.lg};
    display: flex;
    flex-direction: column;

    .body__diceFactors {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.sm};
      padding-bottom: ${props => props.theme.variable.gap.lg};
      margin-bottom: ${props => props.theme.variable.gap.lg};
      border-bottom: 1px solid ${props => props.theme.color.border.default};

      > :last-child {
        padding-top: ${props => props.theme.variable.gap.sm};
      }
    }

    .body__result {
      display: flex;
      flex-direction: column;
      gap: ${props => props.theme.variable.gap.md};

      &.result--check {
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .result__dice {
          .dice__die {
            position: relative;
            width: 32px;
            height: 32px;
            background: none !important;
            border: none;
            z-index: 1;

            svg {
              position: absolute;
              color: ${props => props.theme.color.background.sunken};
              z-index: -1;
            }
          }
        }
      }

      .result__dice {
        display: flex;
        flex-wrap: wrap;
        gap: ${props => props.theme.variable.gap.sm};

        .dice__die {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: ${props => props.theme.color.background.sunken};
          border-radius: ${props => props.theme.variable.borderRadius};
          font-family: ${props => props.theme.variable.fontFamily.display};
          border: 1px solid ${props => props.theme.color.border.bold};
        }
      }

      .result__text {
        text-align: center;
        font-family: ${props => props.theme.variable.fontFamily.display};
        font-size: ${props => props.theme.variable.fontSize.lg};
      }
    }
  }
`;

type RollCardProps = {
  roll: Roll;
  collapsible?: boolean;
};

export const RollCard: React.FC<RollCardProps> = props => {
  const [collapsed, setCollapsed] = useState(props.collapsible ? true : false);

  let dice = props.roll.dice;

  const isRolled = !!props.roll.dice.length;
  const isCheck = props.roll.evaluation === RollEvaluation.CHECK;
  const isFate = isCheck && dice[0] == 20;
  const isFury = isCheck && dice[0] == 1;

  // if roll hasn't been rolled, add pseudo dice based on dice factors
  if (!isRolled) {
    if (isCheck) {
      dice = [-1];
    } else {
      const total = sum(props.roll.diceFactors.map(diceFactor => diceFactor.value));
      dice = [...new Array(Math.max(total, 0))].map(() => -1);
    }
  }

  const total = props.roll.diceFactors.reduce((v, df) => v + df.value, 0);

  return (
    <StyledRollCard
      onClick={props.collapsible ? () => setCollapsed(!collapsed) : undefined}
      style={{ cursor: props.collapsible ? 'pointer' : undefined }}
      className={classNames('card__header', {
        'card--character': !!props.roll.characterId,
        'card--combatant': !props.roll.characterId,
        'card--fate': isFate,
        'card--fury': isFury
      })}
    >
      <div className="card__header" title={`${props.roll.characterName} (${props.roll.label})`}>
        <strong>{props.roll.characterName}</strong> ({props.roll.label})
      </div>

      <div className="card__body">
        <VCollapsible collapsed={collapsed}>
          <div className="body__diceFactors">
            {props.roll.diceFactors.map((diceFactor, i) => {
              let prefix: string | undefined = undefined;

              if (i > 0) {
                prefix = diceFactor.value >= 0 ? '+' : '-';
              } else if (diceFactor.value < 0) {
                prefix = '-';
              }

              return (
                <DiceFactorInput
                  key={i}
                  prefix={prefix}
                  value={Math.abs(diceFactor.value)}
                  label={diceFactor.label}
                />
              );
            })}
            <DiceFactorInput prefix={'='} value={total} label={'Total'} />
          </div>
        </VCollapsible>

        <div
          className={classNames('body__result', {
            'result--check': isCheck
          })}
        >
          <div className="result__dice">
            {dice.map((die, i) => (
              <div key={i} className={`dice__die`}>
                {die > 0 ? die : '?'}
                {isCheck && <D20Icon />}
              </div>
            ))}
          </div>

          <div className="result__text">
            {isCheck && !isFate && !isFury && ` ${total >= 0 ? '+' : '-'} ${Math.abs(total)}`}
            {isRolled && (
              <>
                {isCheck && !isFate && !isFury && ` = ${sum(props.roll.dice) + total}`}
                {!isCheck && sum(props.roll.dice)}
              </>
            )}
          </div>
        </div>
      </div>
    </StyledRollCard>
  );
};

RollCard.defaultProps = {
  collapsible: true
};

const StyledDiceFactorInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.variable.gap.md};
  white-space: nowrap;
  font-size: ${props => props.theme.variable.fontSize.xs};

  .factor__prefix {
    display: flex;
    justify-content: center;
    width: ${props => props.theme.variable.gap.md};
  }
`;

type DiceFactorInputProps = {
  prefix?: string;
  value: number;
  label: string;
};

const DiceFactorInput: React.FC<DiceFactorInputProps> = props => {
  return (
    <StyledDiceFactorInput>
      <div className="factor__prefix">{props.prefix}</div>
      <VNumberInput value={props.value} disabled min={-9} size={20} />
      <div className="factor__label">{props.label}</div>
    </StyledDiceFactorInput>
  );
};
