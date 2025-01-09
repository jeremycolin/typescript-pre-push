const TS_ERROR_REGEX = /^(?<file>.*)\([^()]+\): error TS/;

export function filterTsErrors({
  gitDiffRawString,
  tsErrorsRawInputString,
}: {
  gitDiffRawString: string;
  tsErrorsRawInputString: string;
}): string {
  let commandOutputString = "";

  const gitDiffFiles = new Set(
    gitDiffRawString.split("\n").filter((file) => file.trim() !== "")
  );

  let currentFileInDiff = false;

  const lines = tsErrorsRawInputString.split("\n");
  for (const line of lines) {
    const match = line.match(TS_ERROR_REGEX);
    const fileMatch = match?.groups?.file;

    if (fileMatch) {
      currentFileInDiff = gitDiffFiles.has(fileMatch);
    }

    if (currentFileInDiff) {
      commandOutputString += line + "\n";
    }
  }

  return commandOutputString;
}
