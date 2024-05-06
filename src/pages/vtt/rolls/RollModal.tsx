import { VModal } from '@/components/VModal';
import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { RollCard } from './RollCard';
import { Roll } from '../types/Roll';
import styled from 'styled-components';
import { VNumberInput } from '@/components/VNumberInput';
import { VFlex } from '@/components/VFlex';
import { useVTheme } from '@/common/VTheme';
import { VButton } from '@/components/VButton';

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
  onClose?: () => void;
  newRoll: NewRoll;
};

const RollModal: React.FC<RollModalProps> = props => {
  const theme = useVTheme();

  const [advantage, setAdvantage] = useState(0);
  const [disadvantage, setDisadvantage] = useState(0);

  const diceFactors = useMemo(() => {
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
        value: -disadvantage
      });
    }

    return diceFactors;
  }, [advantage, disadvantage, props.newRoll]);

  const onClose = () => {
    setAdvantage(0);
    setDisadvantage(0);
    props.onClose?.();
  };

  return (
    <StyledRollModal header="New Roll" open={props.open} onClose={onClose}>
      <div className="modal__content">
        <VFlex vertical gap={theme.variable.gap.md}>
          <VFlex justify="space-between" align="center">
            Advantage{' '}
            <VNumberInput value={advantage} onChange={setAdvantage} size={22} controls max={6} />
          </VFlex>

          <VFlex justify="space-between" align="center">
            Disadvantage{' '}
            <VNumberInput
              value={disadvantage}
              onChange={setDisadvantage}
              size={22}
              controls
              max={6}
            />
          </VFlex>
        </VFlex>

        <RollCard
          roll={{
            id: '',
            characterId: props.newRoll.characterId,
            characterName: props.newRoll.characterName,
            label: props.newRoll.label,
            dice: [],
            diceFactors: diceFactors,
            timestamp: '',
            evaluation: props.newRoll.evaluation
          }}
          collapsible={false}
        />

        <VButton type="primary">Roll</VButton>
      </div>
    </StyledRollModal>
  );
};

type _RollModalContext = {
  opened: boolean;
  open: (newRoll: NewRoll) => void;
  close: () => void;
};

const RollModalContext = React.createContext<_RollModalContext>({
  opened: false,
  open: () => {},
  close: () => {}
});

export const useRollModal = () => useContext(RollModalContext);

export const RollModalProvider: React.FC<{ children: ReactNode }> = props => {
  const [opened, setOpened] = useState(false);

  const [newRoll, setNewRoll] = useState<NewRoll>();

  const context = {
    opened,
    open: (newRoll: NewRoll) => {
      setOpened(true);
      setNewRoll(newRoll);
    },
    close: () => setOpened(false)
  };

  return (
    <RollModalContext.Provider value={context}>
      {newRoll && <RollModal open={opened} onClose={() => setOpened(false)} newRoll={newRoll} />}
      {props.children}
    </RollModalContext.Provider>
  );
};
