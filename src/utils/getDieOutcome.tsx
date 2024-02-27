type DieOutcome = {
  label: string;
  color: string;
};

const DIE_OUTCOMES = {
  success: {
    label: 'Success',
    color: '#34a9fe'
  },
  stalemate: {
    label: 'Stalemate',
    color: '#A1A1A1'
  },
  failure: {
    label: 'Failure',
    color: '#F48E16'
  }
};

export const getDieOutcome = (die: number): DieOutcome => {
  if (die === 6) {
    return DIE_OUTCOMES.success;
  } else if (die === 5) {
    return DIE_OUTCOMES.stalemate;
  } else {
    return DIE_OUTCOMES.failure;
  }
};
