# AGENTS.md

This file stores website-specific working notes for Codex.

## Website Dev Server Notes

- If the website page still shows old code after local changes, first suspect a stale `rspress dev` process instead of assuming the latest patch failed.
- The website preview stack uses `@rspress/plugin-preview`, which also starts a preview service and occupies port `7890` by default.
- If port `7890` is already occupied by an older website dev process, a newly started website dev server may fail to reflect the latest page output correctly.
- In that situation, stop the old website `rspress dev` process, then restart the website dev server before continuing debugging.
- After restarting the website dev server, remind the user to do a hard refresh with `Ctrl+Shift+R`.
- When a page still looks stale, prefer verifying the actual running dev server and occupied ports before changing product code again.
