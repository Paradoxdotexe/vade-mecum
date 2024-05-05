export type DiceFactor = {
  type: 'A' | 'D';
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
  label: string;
  dice: number[];
  diceFactor: DiceFactor[];
  timestamp: string;
  evaluation: RollEvaluation;
};
