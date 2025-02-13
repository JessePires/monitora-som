export interface Square {
  audioName: string;
  start: Position;
  end: Position;
  color: string;
  label: string;
  type: string;
  certaintyLevel: string;
  completude: string;
  additionalComments: string;
  roiTable: string;
}

export interface Position {
  x: number;
  y: number;
}
