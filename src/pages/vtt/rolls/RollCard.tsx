import React from 'react';
import styled from 'styled-components';
import { VCard } from '@/components/VCard';
import { Roll, RollEvaluation } from '../types/Roll';
import { startCase, sum } from 'lodash-es';
import { useVTheme } from '@/common/VTheme';

const StyledRollCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  width: 220px;
  overflow: hidden;
  padding: 0;
  border: none;

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
    gap: ${props => props.theme.variable.gap.md};

    .body__dice {
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

    .body__outcome {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${props => props.theme.variable.fontFamily.display};
      font-size: ${props => props.theme.variable.fontSize.lg};
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

  const checkResult =
    props.roll.evaluation === RollEvaluation.CHECK ? getCheckResult(props.roll.dice) : undefined;

  return (
    <StyledRollCard>
      <div
        className="card__header"
        style={{ background: checkResult && theme.color.status[checkResult].border }}
        title={props.roll.label}
      >
        {props.roll.label}
      </div>
      <div className="card__body">
        <div className="body__dice">
          {props.roll.dice.map((die, i) => {
            const dieCheckResult = getCheckResult([die]);

            let ignored = false;
            if (props.roll.evaluation === RollEvaluation.CHECK && i > 0) {
              ignored = true;
            }

            return (
              <div
                key={i}
                className={`dice__die ${ignored ? 'die--ignored' : undefined}`}
                style={{
                  background: theme.color.status[dieCheckResult].border
                }}
              >
                {die}
              </div>
            );
          })}
        </div>

        {props.roll.dice && (
          <div
            className="body__outcome"
            style={{ color: checkResult && theme.color.status[checkResult].text }}
          >
            {checkResult ? startCase(checkResult) : sum(props.roll.dice)}
          </div>
        )}
      </div>
    </StyledRollCard>
  );
};
