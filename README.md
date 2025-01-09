# TypeScript Pre Push

Filter your TypeScript errors to changed files only.

## Simple Usage

`tsc | npx typescript-pre-push`

## Configuration options

By default it's applying a pre push hook command based on main `git diff-tree --no-commit-id --name-only -r HEAD..origin/main` however it's configurable:

`tsc | npx typescript-pre-push -diff='git diff --name-only'`
