# Digital twin

The hub is also where a digital twin of its user is built: a model precise enough that, while the user is away, an agent can make the calls the user would make, and knows which calls only the user can make. The twin is refined for as long as the hub runs.

The twin is the user's judgment carried by an agent. It keeps the user's experience, taste and trade-offs, and keeps the agent's own strengths: it reads everything at once, holds a large context and does not tire. It must not inherit the user's human limits. Rules that exist only because a person can take in little at a time apply when an agent talks to the user, and live with the other rules for talking to the user, never in the twin.

This file is the method. It is framework and holds nothing about a particular user. The twin itself, and every record about how it was built, is personal data and stays local.

## What the twin holds

Only where the user differs from what a capable model would do by default. Anything the model already gets right needs no entry: writing it down adds nothing and costs attention.

An entry must change what the twin would do. Evidence that changes no decision is not recorded. When the user keeps a whole area for themselves, such as "never delete anything; I decide", that is recorded once as an "ask the user" point, and every later candidate in that area is skipped without review.

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
| Human limit | An adaptation to the user's own limits: attention, reading speed, time | Nothing in the twin. If no rule for talking to the user covers it yet, add it there (for example the global `~/.claude/CLAUDE.md`) |
| Already covered | An existing rule already says it | Where it is covered. Nothing new |
| Passing purpose | The request served a goal of that moment, not a lasting preference, such as keeping records because they are material for the twin | Nothing |

The human-limit test matters: a request such as "show me one item at a time" says how the user can take in information, not how the decision should be made. Copying it into the twin would make the twin as slow as the human without any benefit.

### 3. Write each entry

The twin and its evidence live in different files.

**In `twin/model.md`, write the mind, not the quotes.** Write how the user thinks, in the user's first person: what they look at first, what makes them uneasy, how they weigh one thing against another, where they draw a line and why. An agent that reads it should be able to make the call the user would make in a situation the user never met. A list of the user's sayings does not do that.

**Write for a reader with no context.** The twin is read by a new session that knows nothing of the conversations it came from. Every sentence must make sense on first reading to that reader. A phrase that only points at an event ("as with the old data") means nothing to it: describe the situation in full, as a concrete example anyone can follow, or leave it out. Before writing, read the entry as that reader would.

**Write the reasoning, not only the surface.** "Kept folder X" is an event; "keeps what might still be needed, and deletes wholesale what is known to be obsolete, whether or not it can be recovered" is a rule; why the user holds it is what lets the twin extend it.

**In `twin/review.md`, keep the evidence** for each entry:

- the user's words, verbatim, with date and source transcript;
- what the agent proposed or did that the user overrode;
- counter-evidence, only if it changes what the twin would do;
- confidence: one event is a hypothesis; a pattern across events is a rule.

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
