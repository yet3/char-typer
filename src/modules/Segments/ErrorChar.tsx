import { CharsWithSpaces } from "./CharsWithSpaces";

interface IProps {
  char: string;
  expectedChar: string;
}

export const ErrorChar = ({ char, expectedChar }: IProps) => {
  return (
    <span className="text-typer-error relative">
      <CharsWithSpaces chars={expectedChar} />

      <span className="text-typer-mistyped absolute bottom-full left-1/2 -translate-x-1/2">
        <CharsWithSpaces chars={char} />
      </span>
    </span>
  );
};
