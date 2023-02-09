import {Question} from "../constants/QUESTIONS";

export interface Answer {
  playerName: string,
  text: string,
  value: number,
}

export interface Round {
  question?: Question,
  answers?: Answer[],
  index?: number,
  flippedAnswers?: Set<string>,
  values?: string[]; // Array of playerNames, index = value,
}
