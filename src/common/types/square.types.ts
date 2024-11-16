export interface Square {
  start: Position;
  end: Position;
  color: string;
  label: string;
  type: string;
  certaintyLevel: string;
  completude: string;
  additionalComments: string;
}

export interface Position {
  x: number;
  y: number;
}
