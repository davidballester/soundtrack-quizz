export type IQuizzDatabase = IQuizzDatabaseEntry[];

export interface IQuizzDatabaseEntry {
  show: string;
  videoId: string;
  durationInSeconds?: number;
  startAtSeconds?: number;
  focus?: boolean;
}

export type IQuizz = IQuizzDatabaseEntry[];

export interface IQuizzState {
  currentEntryIndex: number;
  entries: IQuizzEntryState[];
}

export interface IQuizzEntryState {
  resolved: boolean;
  givenUp: boolean;
  attempts: number;
}
