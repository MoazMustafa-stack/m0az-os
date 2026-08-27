# Command system

## Pipeline

```text
input -> tokenizer -> stage parser -> definition lookup -> execution -> declared effects
```

The tokenizer supports whitespace, single/double quotes, backslash escapes, flags,
aliases, and a bounded pipe separator. This is deliberately not POSIX shell syntax.

## Public command families

| Family | Commands |
| --- | --- |
| Navigation | `about`, `projects`, `project`, `research`, `experience`, `skills`, `contact`, `resume` |
| Filesystem | `ls`, `cd`, `pwd`, `cat`, `tree`, `open`, `grep` |
| Identity/system | `whoami`, `hostname`, `date`, `uptime`, `env`, `neofetch`, `top`, `ps` |
| Session | `history`, `clear`, `theme`, `sound`, `reboot`, `shutdown`, `reset` |
| Project host | `ssh`, `back`, `git`, `readme`, `architecture`, `stack`, `timeline`, `decisions`, `challenges`, `repo`, `demo` |

Use `man <command>` in the UI for concise contextual help. Hidden commands are
documented only in the owner reference, `docs/easter-eggs.md`.

## Completion and history

Tab completion uses command names for the first token, then projects, current
directory entries, sections, and themes. Multiple matches are printed. Up/Down walk
the bounded session history. Ctrl+L clears and Ctrl+C cancels the current input.

## Adding a command

1. Add a definition to `commandDefinitions`.
2. Add a branch to `executeStage` that returns deterministic lines/effects.
3. Never access a browser or network API inside the command function.
4. Add unit tests for successful, invalid, and contextual use.
5. Update this document and, if hidden, `docs/easter-eggs.md`.
