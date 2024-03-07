import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { rollDie } from '../../utils/rollDie';
import { getDieOutcome } from '../../utils/getDieOutcome';
import { NumberInput } from './NumberInput';

const SkillCheckCardDiv = styled.div`
  background: #3b3b3b;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 200px;
  overflow: hidden;
  font-size: 14px;
  box-shadow: 3px 6px 12px rgba(0, 0, 0, 0.1);

  .card__header {
    font-family: 'Noto Sans Display', sans-serif;
    padding: 6px 12px;
    background: #585858;
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

type SkillCheckCardProps = {
  name: string;
  diceFactors?: DiceFactor[];
  minimized?: boolean;
  diceRoll?: number[];
  onRoll?: (diceRoll: number[]) => void;
};

export const SkillCheckCard: React.FC<SkillCheckCardProps> = props => {
  const [diceFactors, setDiceFactors] = useState<DiceFactor[]>([
    ...(props.diceFactors ?? []),
    { type: 'A', label: 'Advantage', value: 0 },
    { type: 'D', label: 'Disadvantage', value: 0 }
  ]);
  const [diceRoll, setDiceRoll] = useState<number[] | undefined>(props.diceRoll);

  const roll = () => {
    const rollSound = new Audio('/sounds/roll.mp3');
    rollSound.play();
    const diceRoll = [...new Array(total)].map(() => rollDie()).sort((a, b) => b - a);
    setDiceRoll(diceRoll);
    props.onRoll?.(diceRoll);
  };

  const total = Math.max(
    0,
    sum(diceFactors.map(factor => (factor.type === 'A' ? factor.value : -factor.value)))
  );

  const outcome = diceRoll && getDieOutcome(Math.max(...diceRoll));

  return (
    <SkillCheckCardDiv>
      <div className="card__header" style={{ background: outcome?.color }}>
        {props.name}
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
              <button onClick={() => roll()} disabled={total === 0}>
                Roll
              </button>
            </div>

            <div className="body__divider" />
          </>
        )}

        <div className="body__dice">
          {[...new Array(diceRoll?.length ?? total)].map((_, i) => {
            const die = diceRoll?.[i];
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
    </SkillCheckCardDiv>
  );
};

const DiceFactorInputDiv = styled.div`
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
    <DiceFactorInputDiv>
      <div className="factor__prefix">{props.prefix}</div>
      <NumberInput
        value={props.value}
        onChange={props.onChange}
        max={props.max}
        disabled={props.disabled}
      />
      <div className="factor__label">{props.label}</div>
    </DiceFactorInputDiv>
  );
};
