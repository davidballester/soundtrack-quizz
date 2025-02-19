export type IQuizzDatabase = IQuizzDatabaseEntry[];

export interface IQuizzDatabaseEntry {
  show: string;
  videoId: string;
  durationInSeconds?: number;
  startAtSeconds?: number;
}

export type IQuizz = IQuizzDatabaseEntry[];
