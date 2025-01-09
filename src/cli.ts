import { execSync } from "node:child_process";
import { filterTsErrors } from "./parse-ts-errors";

const GIT_DIFF_PRE_PUSH =
  "git diff-tree --no-commit-id --name-only -r HEAD..origin/main";
const GIT_DIFF_PRE_COMMIT = "git diff --name-only";

function getGitDiffCommand() {
  let gitDiffCommand = GIT_DIFF_PRE_PUSH;

  const ARG_REGEX = /^-(?<key>\w+)=(?<value>.*)$/;
  process.argv.slice(2).forEach((arg) => {
    const match = arg.match(ARG_REGEX);
    if (!match) {
      console.error("Malformed argument: ", arg);
      process.exit(1);
    }
    const { key, value } = match.groups!;
    if (key === "diff") {
      gitDiffCommand = value;
    } else {
      console.error("Unknown argument: ", arg);
      process.exit(1);
    }
  });

  return gitDiffCommand;
}

async function main() {
  const gitDiffCommand = getGitDiffCommand();

  const inputStream = process.stdin;
  inputStream.setEncoding("utf-8");

  const inputStreamTimeout = setTimeout(() => {
    console.error("Unable to read from stdin");
    process.exit(1);
  }, 3000);

  inputStream.once("data", () => {
    clearTimeout(inputStreamTimeout);
  });

  let tsErrorsRawInputString = "";

  for await (const chunk of inputStream) {
    tsErrorsRawInputString += chunk;
  }

  const gitDiffRawString = execSync(gitDiffCommand).toString();

  const filteredTsErrors = filterTsErrors({
    gitDiffRawString,
    tsErrorsRawInputString,
  });

  process.stdout.write(filteredTsErrors);
}

main();
