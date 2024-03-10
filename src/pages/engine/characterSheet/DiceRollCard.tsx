import React, { useState } from 'react';
import styled from 'styled-components';
import { rollDie } from '../../../utils/rollDie';
import { getDieOutcome } from '../../../utils/getDieOutcome';
import { VNumberInput } from '../../../components/VNumberInput';
import { VCard } from '@/components/VCard';

const StyledDiceRollCard = styled(VCard)`
  display: flex;
  flex-direction: column;
  width: 200px;
  overflow: hidden;
  font-size: 14px;
  padding: 0;
  border: none;

  .card__header {
    font-family: 'Noto Sans Display', sans-serif;
    padding: 6px 12px;
    background: #585858;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
  }

  .card__body {
    padding: 18px;
    display: flex;
    flex-direction: column;

    .body__factors {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .body__divider {
      background-color: #585858;
      margin-block: 12px;
      height: 1px;
    }

    .body__total {
      display: flex;
      justify-content: space-between;

      button {
        background: #1697f4;
        border: none;
        cursor: pointer;
        color: #fff;
        border-radius: 4px;
        padding: 0 12px;
        height: 20px;
        font-family: inherit;

        &:not(:disabled):hover {
          background: #43a6ec;
        }

        &:disabled {
          cursor: default;
          opacity: 0.6;
        }
      }
    }

    .body__dice {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .dice__die {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #585858;
        border-radius: 4px;
        font-family: 'Noto Sans Display', sans-serif;
        font-size: 16px;
        border: 1px solid #fff;

        &.die--rolled:not(:first-child) {
          opacity: 0.6;
        }
      }
    }

    .body__outcome {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Noto Sans Display', sans-serif;
      font-size: 18px;
      padding-top: 12px;
    }
  }
`;

const sum = (numbers: number[]) => numbers.reduce((sum, n) => sum + n, 0);

type DiceFactor = {
  type: 'A' | 'D';
  label: string;
  value: number;
  max?: number;
};

type DiceRollCardProps = {
  diceFactors?: DiceFactor[];
  label: string;
  roll?: number[];
  onRoll?: (roll: number[]) => void;
  minimized?: boolean;
};

export const DiceRollCard: React.FC<DiceRollCardProps> = props => {
  const [diceFactors, setDiceFactors] = useState<DiceFactor[]>([
    ...(props.diceFactors ?? []),
    { type: 'A', label: 'Advantage', value: 0 },
    { type: 'D', label: 'Disadvantage', value: 0 }
  ]);
  const [roll, setRoll] = useState<number[] | undefined>(props.roll);

  const rollDice = () => {
    const rollSound = new Audio('/sounds/roll.mp3');
    rollSound.addEventListener(
      'canplaythrough',
      () => {
        rollSound.play();
        const roll = [...new Array(total)].map(() => rollDie()).sort((a, b) => b - a);
        setRoll(roll);
        props.onRoll?.(roll);
      },
      false
    );
  };

  const total = Math.max(
    0,
    sum(diceFactors.map(factor => (factor.type === 'A' ? factor.value : -factor.value)))
  );

  const outcome = roll && getDieOutcome(Math.max(...roll));

  return (
    <StyledDiceRollCard>
      <div className="card__header" style={{ background: outcome?.color }}>
        {props.label}
      </div>
      <div className="card__body">
        {!props.minimized && (
          <>
            <div className="body__factors">
              {diceFactors.map((diceFactor, i) => (
                <DiceFactorInput
                  key={i}
                  prefix={i === 0 ? undefined : diceFactor.type === 'A' ? '+' : '-'}
                  label={diceFactor.label}
                  value={diceFactor.value}
                  max={diceFactor.max}
                  onChange={value => {
                    setDiceFactors(diceFactors => {
                      diceFactors[i].value = value;
                      return [...diceFactors];
                    });
                  }}
                />
              ))}
            </div>

            <div className="body__divider" />

            <div className="body__total">
              <DiceFactorInput prefix="=" label="Total" value={total} disabled />
              <button onClick={() => rollDice()} disabled={total === 0 || !!roll}>
                Roll
              </button>
            </div>

            <div className="body__divider" />
          </>
        )}

        <div className="body__dice">
          {[...new Array(roll?.length ?? total)].map((_, i) => {
            const die = roll?.[i];
            const outcome = die !== undefined ? getDieOutcome(die) : undefined;

            return (
              <div
                key={i}
                className={`dice__die ${outcome ? 'die--rolled' : undefined}`}
                style={{ background: outcome?.color }}
              >
                {die ?? '?'}
              </div>
            );
          })}
        </div>

        {outcome && (
          <div className="body__outcome" style={{ color: outcome.color }}>
            {outcome.label}
          </div>
        )}
      </div>
    </StyledDiceRollCard>
  );
};

const StyledDiceFactorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .factor__prefix {
    display: flex;
    justify-content: center;
    width: 6px;
  }
`;

type DiceFactorInputProps = {
  prefix?: string;
  label: string;
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
};

const DiceFactorInput: React.FC<DiceFactorInputProps> = props => {
  return (
    <StyledDiceFactorInput>
      <div className="factor__prefix">{props.prefix}</div>
      <VNumberInput
        value={props.value}
        onChange={props.onChange}
        max={props.max}
        disabled={props.disabled}
      />
      <div className="factor__label">{props.label}</div>
    </StyledDiceFactorInput>
  );
};
