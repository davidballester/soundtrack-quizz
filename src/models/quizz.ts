export type IQuizzDatabase = IQuizzDatabaseEntry[];

export interface IQuizzDatabaseEntry {
  show: string;
  videoId: string;
  durationInSeconds?: number;
  startAtSeconds?: number;
}

export type IQuizz = IQuizzDatabaseEntry[];

export interface IQuizzState {
  currentEntryIndex: number;
  entries: IQuizzEntryState[];
}

export interface IQuizzEntryState {
  resolved: boolean;
  attempts: number;
}
