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
  userId: string;
  characterId: string;
  characterName: string;
  label: string;
  dice: number[];
  diceFactors: DiceFactor[];
  timestamp: string;
  evaluation: RollEvaluation;
};
