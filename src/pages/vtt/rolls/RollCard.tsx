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
  cursor: pointer;

  .card__header {
    font-family: ${props => props.theme.variable.fontFamily.display};
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
};

export const RollCard: React.FC<RollCardProps> = props => {
  const theme = useVTheme();

  const [collapsed, setCollapsed] = useState(true);

  const checkResult =
    props.roll.evaluation === RollEvaluation.CHECK ? getCheckResult(props.roll.dice) : undefined;

  const renderDie = (die: number, index: number) => {
    const dieCheckResult = getCheckResult([die]);

    let ignored = false;
    if (props.roll.evaluation === RollEvaluation.CHECK && index > 0) {
      ignored = true;
    }

    return (
      <div
        key={index}
        className={`dice__die ${ignored ? 'die--ignored' : undefined}`}
        style={{
          background: theme.color.status[dieCheckResult].border
        }}
      >
        {die}
      </div>
    );
  };

  return (
    <StyledRollCard onClick={() => setCollapsed(!collapsed)}>
      <div
        className="card__header"
        style={{ background: checkResult && theme.color.status[checkResult].border }}
        title={props.roll.label}
      >
        {props.roll.label}
      </div>
      <div className="card__body">
        <VCollapsible collapsed={collapsed}>
          <div className="body__diceFactors">
            <DiceFactorInput value={1} label={'Strength'} disabled />
            <DiceFactorInput prefix={'+'} value={2} label={'Power'} disabled />
            <DiceFactorInput prefix={'='} value={3} label={'Total'} disabled />
          </div>
        </VCollapsible>

        <div className="body__result">
          <div className="result__dice">{props.roll.dice.map(renderDie)}</div>

          {props.roll.dice && (
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
  disabled: boolean;
};

const DiceFactorInput: React.FC<DiceFactorInputProps> = props => {
  return (
    <StyledDiceFactorInput>
      <div className="factor__prefix">{props.prefix}</div>
      <VNumberInput value={props.value} disabled={props.disabled} size={20} />
      <div className="factor__label">{props.label}</div>
    </StyledDiceFactorInput>
  );
};
