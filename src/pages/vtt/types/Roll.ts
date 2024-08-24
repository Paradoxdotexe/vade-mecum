export type DiceFactor = {
  label: string;
  value: number;
};

export enum RollEvaluation {
  CHECK = 'CHECK', // D20
  SUM = 'SUM' // D6
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
