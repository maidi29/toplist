export const randomInt =
  (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const shuffleArray = (array: any[]) => [...array].sort((a, b) => 0.5 - Math.random());

