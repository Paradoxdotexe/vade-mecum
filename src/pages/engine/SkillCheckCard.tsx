import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { rollDie } from '../../utils/rollDie';
import { getDieOutcome } from '../../utils/getDieOutcome';

const SkillCheckCardDiv = styled.div`
  background: #3b3b3b;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 200px;
  overflow: hidden;
  font-size: 14px;

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
};

export const SkillCheckCard: React.FC<SkillCheckCardProps> = props => {
  const [diceFactors, setDiceFactors] = useState<DiceFactor[]>([
    ...(props.diceFactors ?? []),
    { type: 'A', label: 'Advantage', value: 0 },
    { type: 'D', label: 'Disadvantage', value: 0 }
  ]);
  const [diceRoll, setDiceRoll] = useState<number[]>();

  useEffect(() => {
    setDiceRoll(undefined);
  }, [diceFactors]);

  const roll = () => {
    const rollSound = new Audio('/sounds/roll.mp3');
    rollSound.play();
    setDiceRoll([...new Array(total)].map(() => rollDie()).sort((a, b) => b - a));
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
            {diceRoll ? 'Re-roll' : 'Roll'}
          </button>
        </div>

        <div className="body__divider" />

        <div className="body__dice">
          {[...new Array(total)].map((_, i) => {
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

  .factor__value {
    font-family: 'Noto Sans Display', sans-serif;
    padding: 0;
    border: none;
    color: #fff;
    width: 20px;
    height: 20px;
    background: #585858;
    border-radius: 4px;
    outline: none;
    text-align: center;

    &.value--error {
      border: 1px solid #ec4343;
    }
  }
`;

type DiceFactorInputProps = {
  prefix?: string;
  label: string;
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const DiceFactorInput: React.FC<DiceFactorInputProps> = props => {
  const [value, setValue] = useState(props.value.toString());

  const validated = useMemo(() => {
    const newValue = parseInt(value);
    return !Number.isNaN(newValue) && (!props.max || newValue <= props.max);
  }, [value]);

  useEffect(() => {
    if (validated) {
      props.onChange?.(parseInt(value));
    }
  }, [value]);

  useEffect(() => {
    if (props.value !== parseInt(value)) {
      setValue(props.value.toString());
    }
  }, [props.value]);

  return (
    <DiceFactorInputDiv>
      <div className="factor__prefix">{props.prefix}</div>
      <input
        className={`factor__value ${!validated ? 'value--error' : ''}`}
        value={value}
        onChange={event => setValue(event.target.value.slice(0, 1))}
        disabled={props.disabled}
      />
      <div className="factor__label">{props.label}</div>
    </DiceFactorInputDiv>
  );
};
