export type DiceFactor = {
  label: string;
  value: number;
};

export enum RollEvaluation {
  CHECK = 'CHECK',
  SUM = 'SUM'
}

export type Roll = {
  id: string;
  characterId: string;
  characterName: string;
  label: string;
  dice: number[];
  diceFactors: DiceFactor[];
  timestamp: string;
  evaluation: RollEvaluation;
};
