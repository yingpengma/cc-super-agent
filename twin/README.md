# Digital twin

The hub is also where a digital twin of its user is built: a model precise enough that, while the user is away, an agent can make the calls the user would make, and knows which calls only the user can make. The twin is refined for as long as the hub runs.

This file is the method. It is framework and holds nothing about a particular user. The twin itself, and every record about how it was built, is personal data and stays local.

## What the twin holds

Only where the user differs from what a capable model would do by default. Anything the model already gets right needs no entry: writing it down adds nothing and costs attention.

## Sources

- The user's own messages in every Claude Code transcript on the machine (`~/.claude/projects/*/*.jsonl`), each read together with the agent turn it answers.
- The work records of this hub (`tasks/`), which quote the user's words and log their decisions.

## Method

### 1. Find the misalignments

- **Aligned:** the user accepts what the agent proposed, such as "ok" or "yes". The default was right. Write nothing, and infer nothing from it.
- **Misaligned:** the user corrects, refuses, overrides, questions or asks for verification, or goes further than the agent proposed. Each one is where the default failed to predict the user, and is a candidate.

### 2. Classify each candidate by its cause

| Cause | Meaning | What to write |
| --- | --- | --- |
| Judgment | The user's own values or trade-offs, stable enough to predict | A rule the twin follows, with the reasoning behind it |
| Private knowledge | Depends on something only the user knows, such as whether a project is still needed | An "ask the user" point: when to ask, what to ask, and what to prepare so the user can answer at a glance |
| Human limit | An adaptation to the user's own limits: attention, reading speed, time | A rule for agents talking to the human. The twin is not bound by it when it decides on its own; it can weigh everything at once |
| Already covered | An existing rule already says it | Where it is covered. Nothing new |

The human-limit test matters: a request such as "show me one item at a time" says how the user can take in information, not how the decision should be made. Copying it into the twin would make the twin as slow as the human without any benefit.

### 3. Write each entry with its evidence

- the user's words, verbatim, with date and source transcript;
- what the agent proposed or did that the user overrode;
- counter-evidence, if any;
- confidence: one event is a hypothesis; a pattern across events is a rule.

Write the reasoning behind a rule, not only its surface. "Kept folder X" is an event; "keeps what might still be needed, and deletes wholesale what is known to be obsolete, whether or not it can be recovered" is a rule.

### 4. Review with the user

Go through candidates one at a time. Nothing enters the twin without the user's agreement. Record each verdict, including the ones that add nothing, so a candidate is never reviewed twice.

### 5. Iterate

A correction of the twin is itself a misalignment and goes back through steps 1 to 4. Record which sources have been processed, so work resumes where it stopped in a new session.

## Files

| File | Holds | Committed |
| --- | --- | --- |
| `twin/README.md` | This method | Yes |
| `twin/model.md` | The twin: reviewed entries, by area | No |
| `twin/review.md` | Candidates found, with their verdicts or "pending" | No |
| `twin/sources.md` | Which sources have been processed, and where to resume | No |
