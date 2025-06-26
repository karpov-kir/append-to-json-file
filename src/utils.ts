export function removeFirstAndLastBrackets(text: string): string {
  const result = text.slice(1, text.length - 1).trim();

  return result;
}

export function countNewLinesAndSpacesBeforeLastBracket({
  fileTail,
  lastBracketIndex,
  pretty,
}: {
  fileTail: string;
  lastBracketIndex: number;
  pretty: boolean;
}): number {
  let newLinesAndSpacesBeforeLastBracket = 0;

  if (pretty) {
    for (let i = lastBracketIndex - 1; i >= 0; i--) {
      const character = fileTail[i];

      if (!character) {
        break;
      }

      if (/[\s]/.test(character)) {
        newLinesAndSpacesBeforeLastBracket++;
      } else {
        break;
      }
    }
  }

  return newLinesAndSpacesBeforeLastBracket;
}
