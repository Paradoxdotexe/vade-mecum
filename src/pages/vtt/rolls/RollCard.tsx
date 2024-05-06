import React, { useState } from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { Roll, RollEvaluation } from '../types/Roll';
import { startCase, sum } from 'lodash-es';
import { useVTheme } from '@/common/VTheme';
import { VNumberInput } from '@/components/VNumberInput';
import { VCollapsible } from '@/components/VCollapsible';

const StyledRollCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  width: 220px;
  overflow: hidden;
  padding: 0;
  border: none;

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

          &.die--ignored {
            opacity: 0.6;
          }
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

enum CheckResult {
  SUCCESS = 'success',
  STALEMATE = 'stalemate',
  FAILURE = 'failure'
}

const getCheckResult = (dice: number[]) => {
  const maxDie = Math.max(...dice);
  switch (maxDie) {
    case 6:
      return CheckResult.SUCCESS;
    case 5:
      return CheckResult.STALEMATE;
    default:
      return CheckResult.FAILURE;
  }
};

type RollCardProps = {
  roll: Roll;
  collapsible?: boolean;
};

export const RollCard: React.FC<RollCardProps> = props => {
  const theme = useVTheme();

  const [collapsed, setCollapsed] = useState(props.collapsible ? true : false);

  const isRolled = !!props.roll.dice.length;
  const isCheck = props.roll.evaluation === RollEvaluation.CHECK;

  const checkResult = isRolled && isCheck ? getCheckResult(props.roll.dice) : undefined;

  let dice = props.roll.dice;

  // if roll hasn't been rolled, add pseudo dice based on dice factors
  if (!isRolled) {
    const total = sum(props.roll.diceFactors.map(diceFactor => diceFactor.value));
    dice = [...new Array(Math.max(total, 0))].map(() => -1);
  }

  const renderDie = (die: number, index: number) => {
    const dieCheckResult = getCheckResult([die]);
    const color = die > 0 ? theme.color.status[dieCheckResult].border : undefined;

    let ignored = false;
    if (isRolled && isCheck && index > 0) {
      ignored = true;
    }

    return (
      <div
        key={index}
        className={`dice__die ${ignored ? 'die--ignored' : undefined}`}
        style={{
          background: color
        }}
      >
        {die > 0 ? die : '?'}
      </div>
    );
  };

  return (
    <StyledRollCard
      onClick={props.collapsible ? () => setCollapsed(!collapsed) : undefined}
      style={{ cursor: props.collapsible ? 'pointer' : undefined }}
    >
      <div
        className="card__header"
        style={{ background: checkResult && theme.color.status[checkResult].border }}
        title={`${props.roll.characterName} (${props.roll.label})`}
      >
        <strong>{props.roll.characterName}</strong> ({props.roll.label})
      </div>

      <div className="card__body">
        <VCollapsible collapsed={collapsed}>
          <div className="body__diceFactors">
            {props.roll.diceFactors.map((diceFactor, i) => {
              let prefix: string | undefined = undefined;

              if (i > 0) {
                prefix = diceFactor.value >= 0 ? '+' : '-';
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
            <DiceFactorInput prefix={'='} value={dice.length} label={'Total'} />
          </div>
        </VCollapsible>

        <div className="body__result">
          <div className="result__dice">{dice.map(renderDie)}</div>

          {isRolled && (
            <div
              className="result__text"
              style={{ color: checkResult && theme.color.status[checkResult].text }}
            >
              {checkResult ? startCase(checkResult) : sum(props.roll.dice)}
            </div>
          )}
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
      <VNumberInput value={props.value} disabled size={20} />
      <div className="factor__label">{props.label}</div>
    </StyledDiceFactorInput>
  );
};
