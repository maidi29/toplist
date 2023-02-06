export interface Answer {
  playerName: string,
  text: string,
  value: number,
}

export interface Round {
  question?: string,
  answers?: Answer[],
  winner?: string,
  index?: number,
  flippedAnswers?: Set<string>,
  values?: string[]; // Array of playerNames, index = value
}
