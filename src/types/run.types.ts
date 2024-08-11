export enum RunStatus {
  IDLE = "IDLE",
  IN_PROGRESS = "IN_PROGRESS",
  OVER = "OVER",
}

export enum RunType {
  LENGTH_CHARS = "LENGTH_CHARS",
  TIMED_CHARS = "TIMED_CHARS",
  INFINITE_CHARS = "INFINITE_CHARS",
}

type MakeRunOpts<
  TType extends RunType,
  TData extends Record<string, unknown> = Record<string, unknown>,
> = {
  type: TType;
  charsSettings: Partial<IRunCharsSettings>;
} & TData;

export interface IRunCharsSettings {
  lowerCaseLetters: boolean;
  upperCaseLetters: boolean;
  spaces: boolean;
  numbers: boolean;
  symbols: boolean;
}

export type IRunOptions =
  | MakeRunOpts<RunType.TIMED_CHARS>
  | MakeRunOpts<RunType.LENGTH_CHARS>
  | MakeRunOpts<RunType.INFINITE_CHARS>;

export interface IRunStats {
  cpsList: number[];
  typedCharsCount: number;
  errorsCount: number;
}

export interface ISegment {
  key: string;
  idx: number;
  expected: string;
  value: string;
  isVisible: boolean;
  offset: number;
}
