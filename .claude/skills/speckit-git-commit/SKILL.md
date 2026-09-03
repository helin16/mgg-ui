---
name: "speckit-git-commit"
description: "Stage and commit outstanding changes, using the Spec Kit git extension's auto-commit config for hook-driven runs."
argument-hint: "Optional hook event name (e.g. after_specify); omit for a manual commit"
compatibility: "Requires spec-kit project structure with .specify/ directory and the git extension under .specify/extensions/git/"
metadata:
  author: "github-spec-kit"
  source: ".specify/extensions/git/commands/speckit.git.commit.md"
user-invocable: true
disable-model-invocation: true
---

# Auto-Commit Changes

Stage and commit outstanding changes in the repository. This is the Claude Code
registration of the Spec Kit git extension's `speckit.git.commit` command, wired
to the extension scripts under `.specify/extensions/git/`.

## Execution

**If an argument is given** (a hook event name such as `after_specify`,
`before_plan`, `after_clarify`): delegate to the extension script, which only
commits when that event is enabled in `.specify/extensions/git/git-config.yml`:

```bash
bash .specify/extensions/git/scripts/bash/auto-commit.sh <event_name>
```

Report the script's output verbatim (it prints `[OK] …`, a skip warning, or an
error).

**If no argument is given** (manual `/speckit-git-commit`): the per-event config
gate does not apply. Do this directly:

1. Run `git rev-parse --is-inside-work-tree` — if it fails, report "not a git
   repository" and stop.
2. Run `git status --short`. If there is nothing to commit, say so and stop.
3. Show the user the `git status --short` output and the branch name, and state
   the commit message you will use:
   - Derive it from the most recent Spec Kit activity when obvious
     (e.g. `[Spec Kit] Clarify specification` after a `/speckit-clarify` run,
     `[Spec Kit] Add specification` after `/speckit-specify`).
   - Otherwise use `[Spec Kit] Commit spec working changes`.
4. Unless the user already said to proceed, ask for confirmation first — this
   stages **all** changes (`git add -A`).
5. On confirmation: `git add -A` then
   `git commit -m "<message>"` (append the standard
   `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer).
6. Report the resulting commit hash and subject.

## Graceful degradation

- Git not installed, or not a repository → skip with a warning, do not error.
- No changes → report "nothing to commit", do not create an empty commit.
- Never force-push, amend, or rewrite history from this command.

## Notes

- The other git-extension commands (`speckit.git.feature`,
  `speckit.git.initialize`, `speckit.git.remote`, `speckit.git.validate`) have
  matching scripts under `.specify/extensions/git/scripts/bash/` but are not yet
  registered as Claude Code skills. Register them the same way if needed.
- `.specify/extensions/.registry` still lists the git extension's commands only
  under `codex`; this skill file is what makes the command resolve in Claude
  Code. Re-running the Spec Kit extension installer for the claude integration
  would regenerate these properly.
