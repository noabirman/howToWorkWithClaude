# Content plan: "Claude Code, from zero"

Audience: students who have never used a coding agent. Goal: productive in 30 minutes, with a reference they keep open afterwards.

Source of truth: official docs at code.claude.com (researched 2026-10-14). Shortcuts and commands change often, so each section links to the docs.

## Page structure (single page, sticky nav, search, light/dark)
1. **Hero**: what an agent is, animated terminal demo, 3 install-free-of-jargon bullets.
2. **Quick start**: install per OS, login, first session, first prompt, one-shot `claude -p`.
3. **How it works**: the agentic loop (gather, act, verify), the tools Claude uses, the context window and compaction, checkpoints.
4. **Permission modes**: Manual, Edit automatically, Plan, Auto; Shift+Tab cycle; what is safe for beginners.
5. **Shortcuts**: filterable cards (general, editing, multiline, prefixes `/ ! @ ?`).
6. **Slash commands**: searchable table grouped by purpose.
7. **Memory (CLAUDE.md)**: locations, what to write, example, auto memory.
8. **Extend Claude**: skills, subagents, hooks, MCP, plugins as tabs with copyable examples.
9. **Prompting that works**: vague vs specific, verify loops, explore-plan-code-commit, TDD.
10. **Context hygiene**: /clear, /compact, /context, /btw, subagents.
11. **Mistakes and safety**: top mistakes, secrets, git as a safety net.
12. **CLI flags and settings**: flags table, settings.json example with allow/deny.
13. **Models**: aliases, /model, /effort.
14. **Sources**.

## Accuracy notes
- No `#` memory shortcut (not in docs).
- Ctrl+C: first press clears the prompt, the second exits.
- Esc Esc: clears text, or opens rewind when the prompt is empty.
- Newer versions may start in Auto mode, so tell students how to check and change it.
- `/vim` and `/pr-comments` are removed, `/cost` is an alias of `/usage`, `/review` is an alias of `/code-review`.

## Tech
Static HTML/CSS/JS, no build step, deploys directly on GitHub Pages (`.nojekyll`).
