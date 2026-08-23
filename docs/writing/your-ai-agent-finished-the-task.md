# Your AI Agent Finished the Task. What Did It Actually Prove?

*A practical framework for separating implementation, tests, state, side effects, privacy, and external corroboration when AI agents do technical work.*

**Published:** August 23, 2026  
**Author:** David Turner

## Abstract

AI coding agents are very good at producing a convincing terminal state: files changed, tests green, pull request open, task marked complete. But each of those proves something narrower than it appears to. This essay develops a layered evidence model for agentic technical work using concrete examples from production telemetry, open-source contributions, interoperability work, and adversarial review. The central idea is simple: treat “done” as a claim that must survive the right falsification boundary, not as a status emitted by the agent that performed the work.

---

When an AI agent says **“task complete,”** what exactly has happened?

Sometimes the answer is genuinely impressive. The agent inspected a repository, changed the right files, wrote tests, opened a pull request, waited for CI, responded to review, and left the system in a better state.

But “complete” can also mean something much weaker:

- the code compiled;
- the happy-path test passed;
- a deployment existed;
- an event appeared in an analytics dashboard;
- a pull request was technically mergeable;
- a script emitted the expected text.

Those are useful facts. They are not interchangeable with the claim we usually care about: **the intended result is actually true.**

The more I use coding agents, the more I think the difficult part is moving from **execution evidence** to **assurance evidence**.

## The problem with a binary completion state

Human software teams already know that “works on my machine” is not a release criterion. Agentic workflows amplify the same problem because the agent can generate not only the implementation but also the tests, the explanation, and the completion report.

That creates a subtle epistemic loop: the same system that made the change may also be the system telling you why the change is correct.

The solution is not to distrust agents. It is to make the proof boundary explicit.

I now try to ask a sequence of narrower questions:

1. **Did the implementation change?**
2. **Does the intended behavior execute?**
3. **Do tests exercise the failure mode rather than merely the happy path?**
4. **Did the external state actually change?**
5. **Does the stored/output data satisfy the privacy and fidelity contract?**
6. **Did independent evidence challenge or corroborate the claim?**
7. **What still remains unproven?**

That last question is especially valuable. A completion report that cannot name its remaining uncertainty is usually too broad.

## Example 1: an analytics event is not a privacy proof

I recently added optional analytics to a local-first evidence application called Validation Ledger.

The initial implementation looked conservative: explicit allowlisted events, no user-entered evidence in event properties, no session replay, no pageview capture, anonymous usage, and a production-safe configuration.

Then an event successfully reached the analytics project.

That could have been the end of the task: **telemetry works.**

Instead, I inspected the actual stored event. The analytics SDK was still contributing automatic browser and geolocation-related metadata that violated the privacy goal.

So the successful event was actually evidence of two different things:

- ingestion worked;
- the privacy contract did **not** yet hold.

The implementation was changed to strip automatic browser/URL surfaces and disable GeoIP enrichment. A new event was generated from the privacy-fixed deployment, the newly stored payload was inspected, and only then was the mission closed.

The useful lesson was not “remember this particular analytics setting.” It was broader:

> **If the claim concerns what a remote system stores, inspect what the remote system stored.**

A mocked capture function proves your application attempted to send the right object. It does not prove the destination persisted only that object.

## Example 2: interoperability requires a boundary, not a file extension

Another project, Agent Session Bridge, began with a proprietary provider-neutral session format. After external technical feedback pointed me toward the Agent Trajectory Interchange Format (ATIF), the right response was not to defend the format I had already built. It was to test whether the public standard already solved the portable trajectory problem better.

It did.

The architecture changed: ATIF became the canonical portable trajectory layer, while project-specific provenance and fidelity accounting moved into a namespaced extension.

But even after that correction, “ATIF migration complete” was still too broad without additional evidence.

Review found problems such as:

- human-readable report text contaminating machine-readable JSON output;
- malformed source records reaching assumptions they should never reach;
- missing tool-call IDs creating the possibility of false correlations;
- unsupported tool-result content being silently discarded;
- redaction missing structured content;
- sensitive workspace paths surviving in extension metadata.

Those were fixed and regression-tested. Then a later outside-the-diff review found an even narrower issue: a system record could still be treated as a tool-result source when only user records should be eligible.

That late finding did not invalidate the entire architecture. It changed the state from “finished forever” to “finished, with a new corrective defect.”

This is an important distinction in agentic work: **completion should be revisable when better evidence arrives.**

And there is another boundary that matters here. ATIF can make a trajectory portable. That does not mean an arbitrary coding-agent runtime can ingest that trajectory as native resumable state. A target runtime still owns its persistence, security, and resumption semantics.

So the correct claim is deliberately narrower than the tempting one.

## Example 3: external review can falsify the premise, not just the patch

In an open-source contribution to Rosetta, one maintainer response was especially useful because it challenged the target of the work itself.

The analysis around an authorization path was reasonable, but the specific `team`-policy behavior I was changing turned out to be dead code. The maintainer's response effectively said: the reasoning checks out, but this is not the live boundary you think it is.

That is not a cosmetic review comment. It is evidence that the implementation premise needs to change.

The right response was to remove the stale policy path and preserve only the live behavior that still mattered.

On another Rosetta contribution, a maintainer independently pressure-tested a performance optimization across roughly 5.5 million inputs, reported zero divergences, and reproduced the speed improvement. That is much stronger evidence than my own benchmark alone—but it still does not mean the PR is merged or adopted. The lifecycle state remains **independently corroborated and awaiting maintainer review**.

Good evidence makes claims more precise in both directions. Sometimes it strengthens confidence. Sometimes it narrows the conclusion.

## Example 4: the correction is part of the evidence

A public authorization-design discussion around CrewAI and an external runtime produced another useful pattern.

I had proposed separating semantic request identity from a specific one-time authorization occurrence and then used replay, freshness, caller-binding, and consumption cases to pressure-test the design.

Later, an external builder checked six follow-up findings against shipped code. Five were confirmed as stated. One of my findings was partly misphrased—but the narrower underlying issue was still real.

That correction is not an embarrassment to remove from the story. It is one of the best pieces of evidence in it.

A verification process that only records confirmations becomes marketing. A process that preserves corrections becomes engineering evidence.

## A layered model of “done”

I find it useful to separate at least five layers.

### 1. Artifact evidence

The files, commit, branch, or configuration actually changed.

This answers: **did the agent produce something?**

It does not answer whether the result works.

### 2. Behavioral evidence

The relevant code path executes and focused tests exercise both success and failure cases.

This answers: **does the implemented behavior survive known counterexamples?**

It does not prove deployment or external state.

### 3. State and provenance evidence

The output can be traced to the inputs and transformation that produced it; degraded or unsupported information is represented explicitly rather than silently normalized away.

This answers: **what exactly survived the transformation, and what did not?**

### 4. Boundary evidence

The real external seam was observed: production deployment, stored analytics payload, actual API behavior, persisted state, dispatch receipt, or whatever the claim ultimately depends on.

This answers: **did the world outside the agent's local workspace match the intended result?**

### 5. Independent evidence

A maintainer, reviewer, separate implementation, external reproduction, or other independent source challenges the claim.

This answers: **does the conclusion survive scrutiny outside the system that generated it?**

Not every task requires all five layers. A spelling fix does not need a distributed-systems proof. The point is to choose the evidence layer that matches the consequence of the claim.

## A practical completion receipt

For consequential agent work, I now want the final report to function more like a receipt than a victory announcement.

A useful receipt contains:

**Claim** — What is now believed to be true?

**Change** — What implementation or system state changed?

**Verification** — What test would have failed if the change were wrong?

**Boundary observation** — What real external state was inspected, if applicable?

**Independent challenge** — What review or corroboration exists?

**Known limitation** — What remains outside the evidence?

**Next gate** — Is there an external actor or future condition that still matters?

This structure is boring in exactly the right way. It makes it harder for an agent—or a human—to smuggle ambition into the wording of the conclusion.

## What I would change in agent workflows

If I were designing a default workflow for high-consequence coding-agent tasks, I would make several behaviors routine:

- **Inspect before editing.** Recover live state instead of trusting a stale task description.
- **Write the completion gate before the implementation.** The agent should know what evidence can actually close the task.
- **Test the failure boundary.** A positive test is rarely enough when the bug is about identity, replay, persistence, privacy, or side effects.
- **Observe the external system.** If the claim depends on production, check production.
- **Keep degradation explicit.** Unsupported data should be counted or reported, not quietly discarded.
- **Separate implementation from adoption.** An open PR, automated review, or expert comment is not a merge, endorsement, or product adoption.
- **Allow completion to reopen.** A later valid finding is new evidence, not a contradiction that must be hidden.
- **State the strongest nonclaim.** “This does not prove X” is often the sentence that makes the rest trustworthy.

## The uncomfortable implication

AI agents make it much cheaper to create artifacts. They also make it cheaper to create *the appearance of verification* around those artifacts.

A generated test suite, generated release note, generated benchmark, and generated confidence statement can all agree with one another because they share the same blind spot.

That does not make agent-generated evidence useless. It makes **evidence independence and boundary selection** more important.

The most valuable question may not be:

> Did the agent finish?

It may be:

> **What observation would prove the agent's completion claim wrong—and did we actually make that observation possible?**

That question changes the workflow. It turns “done” from a status into a falsifiable claim.

And that is a much better foundation for trusting increasingly autonomous technical systems.

---

## Author

**David Turner** builds and audits evidence-sensitive AI workflows and developer tools, with work spanning local-first applications, coding-agent interoperability, falsification testing, technical documentation, and open-source contributions.
