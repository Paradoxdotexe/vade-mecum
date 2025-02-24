import { VModal } from '@/components/VModal';
import React, { ReactNode, useContext, useMemo, useRef, useState } from 'react';
import { RollCard } from './RollCard';
import { Roll, RollEvaluation } from '../types/Roll';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { VButton } from '@/components/VButton';
import { v4 as uuid } from 'uuid';
import { sum } from 'lodash-es';
import { rollDie } from '@/utils/rollDie';
import { DateTime } from 'luxon';
import { useRolls } from './useRolls';
import { useVTTUser } from '@/common/VTTUser';
import { playSound } from '@/utils/playSound';

const StyledRollModal = styled(VModal)`
  .modal__content {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.variable.gap.lg};
    padding: ${props => props.theme.variable.gap.lg};
  }
`;

type NewRoll = Pick<Roll, 'characterId' | 'characterName' | 'label' | 'diceFactors' | 'evaluation'>;

type RollModalProps = {
  open: boolean;
  onClose?: (roll?: Roll) => void;
  newRoll: NewRoll;
};

const RollModal: React.FC<RollModalProps> = props => {
  const theme = useVTheme();
  const user = useVTTUser();
  const { addRoll } = useRolls();

  const [advantage, setAdvantage] = useState(0);
  const [disadvantage, setDisadvantage] = useState(0);

  const pendingRoll = useMemo(() => {
    const diceFactors = [...props.newRoll.diceFactors];

    if (advantage) {
      diceFactors.push({
        label: 'Advantage',
        value: advantage
      });
    }

    if (disadvantage) {
      diceFactors.push({
        label: 'Disadvantage',
        value: disadvantage
      });
    }

    return {
      id: '',
      userId: user.authenticated ? user.id : '',
      characterId: props.newRoll.characterId,
      characterName: props.newRoll.characterName || 'Unnamed Character',
      label: props.newRoll.label,
      dice: [],
      diceFactors,
      timestamp: '',
      evaluation: props.newRoll.evaluation
    };
  }, [props.newRoll, advantage, disadvantage]);

  const onClose = (roll?: Roll) => {
    setAdvantage(0);
    setDisadvantage(0);
    props.onClose?.(roll);
  };

  const onRoll = () => {
    const id = uuid();
    const timestamp = DateTime.now().toISO();

    // roll the dice!
    const total = sum(pendingRoll.diceFactors.map(diceFactor => diceFactor.value));
    let dice: number[] = [];
    if (pendingRoll.evaluation === RollEvaluation.SUM) {
      dice = [...new Array(total)].map(() => rollDie()).sort((a, b) => b - a);
    } else [(dice = [rollDie(20)])];

    const roll = { ...pendingRoll, id, timestamp, dice };
    addRoll(roll);
    onClose(roll);
    playSound('/sounds/DiceRoll.mp3');
  };

  return (
    <StyledRollModal header="New Roll" open={props.open} onClose={() => onClose()}>
      <div className="modal__content">
        <VFlex vertical gap={theme.variable.gap.md}>
          <VFlex justify="space-between" align="center">
            Advantage{' '}
            <VNumberInput
              value={advantage}
              onChange={setAdvantage}
              size={22}
              controls
              max={6}
              characters={2}
            />
          </VFlex>

          <VFlex justify="space-between" align="center">
            Disadvantage{' '}
            <VNumberInput
              value={disadvantage}
              onChange={setDisadvantage}
              size={22}
              controls
              min={-6}
              max={0}
              characters={2}
            />
          </VFlex>
        </VFlex>

        <RollCard roll={pendingRoll} collapsible={false} />

        <VButton type="primary" onClick={onRoll}>
          Roll
        </VButton>
      </div>
    </StyledRollModal>
  );
};

type _RollModalContext = {
  opened: boolean;
  open: (newRoll: NewRoll) => Promise<Roll>;
  close: () => void;
};

const RollModalContext = React.createContext<_RollModalContext>({
  opened: false,
  open: () => new Promise(() => {}),
  close: () => {}
});

export const useRollModal = () => useContext(RollModalContext);

export const RollModalProvider: React.FC<{ children: ReactNode }> = props => {
  const [opened, setOpened] = useState(false);

  const [newRoll, setNewRoll] = useState<NewRoll>();

  const onRoll = useRef<(roll: Roll) => void>();

  const context = {
    opened,
    open: (newRoll: NewRoll) => {
      setOpened(true);
      setNewRoll(newRoll);

      return new Promise<Roll>(resolve => {
        onRoll.current = resolve;
      });
    },
    close: () => setOpened(false)
  };

  return (
    <RollModalContext.Provider value={context}>
      {newRoll && (
        <RollModal
          open={opened}
          onClose={roll => {
            setOpened(false);
            roll && onRoll.current?.(roll);
          }}
          newRoll={newRoll}
        />
      )}
      {props.children}
    </RollModalContext.Provider>
  );
};
